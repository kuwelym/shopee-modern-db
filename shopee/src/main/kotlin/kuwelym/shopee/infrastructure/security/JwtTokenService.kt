package kuwelym.shopee.infrastructure.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.UnsupportedJwtException
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import jakarta.annotation.PostConstruct
import kuwelym.shopee.domain.services.TokenService
import kuwelym.shopee.infrastructure.services.TokenBlacklistService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.Date
import javax.crypto.SecretKey

@Service
class JwtTokenService(
    private val tokenBlacklistService: TokenBlacklistService,
) : TokenService {
    @Value("\${application.security.jwt.secret-key}")
    private lateinit var secretKey: String

    private lateinit var key: SecretKey
    private val expirationTime = 1000 * 60 * 60 * 10 // 10 hours

    @PostConstruct
    fun init() {
        val keyBytes = Decoders.BASE64.decode(secretKey)
        key = Keys.hmacShaKeyFor(keyBytes)
    }

    override fun generateToken(
        username: String,
        userType: String,
        expires: Long?,
    ): String {
        val tokenExpirationTime = expires ?: expirationTime.toLong()
        return Jwts.builder()
            .subject(username)
            .claim("userType", userType)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + tokenExpirationTime))
            .signWith(key, Jwts.SIG.HS384)
            .compact()
    }

    override fun extractUsername(token: String): String? = extractClaims(token) { it.subject }

    fun extractUserType(token: String): String? = extractClaims(token) { it["userType"] as? String }

    override fun validateToken(token: String): Boolean {
        return try {
            if (tokenBlacklistService.isTokenBlacklisted(token)) {
                return false
            }
            val claims =
                Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .payload
            claims.expiration.after(Date())
        } catch (e: ExpiredJwtException) {
            false
        } catch (e: UnsupportedJwtException) {
            false
        } catch (e: MalformedJwtException) {
            false
        } catch (e: IllegalArgumentException) {
            false
        } catch (e: Exception) {
            false
        }
    }

    override fun invalidateToken(token: String) {
        tokenBlacklistService.blacklistToken(token)
    }

    private fun <T> extractClaims(
        token: String,
        claimsResolver: (Claims) -> T,
    ): T? =
        try {
            val claims =
                Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .payload
            claimsResolver(claims)
        } catch (e: Exception) {
            null
        }
}
