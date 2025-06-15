package kuwelym.shopee.security

import io.jsonwebtoken.*
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import jakarta.annotation.PostConstruct
import kuwelym.shopee.service.TokenBlacklistService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtUtil(
    private val tokenBlacklistService: TokenBlacklistService
) {
    @Value("\${application.security.jwt.secret-key}")
    private lateinit var secretKey: String

    private lateinit var key: SecretKey
    private val EXPIRATION_TIME = 1000 * 60 * 60 * 10 // 10 hours

    @PostConstruct
    fun init() {
        val keyBytes = Decoders.BASE64.decode(secretKey)
        key = Keys.hmacShaKeyFor(keyBytes)
    }

    fun generateToken(username: String, expires: Long = EXPIRATION_TIME.toLong()): String =
        Jwts.builder()
            .subject(username)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + expires))
            .signWith(key, Jwts.SIG.HS384)
            .compact()

    fun extractUsername(token: String): String? =
        extractClaims(token) { it.subject }

    fun <T> extractClaims(token: String, claimsResolver: (Claims) -> T): T? =
        try {
            val claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .payload
            claimsResolver(claims)
        } catch (e: Exception) {
            null
        }

    fun validateToken(token: String): Boolean {
        return try {
            if (tokenBlacklistService.isTokenBlacklisted(token)) {
                return false
            }
            val claims = Jwts.parser()
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
}
