package kuwelym.shopee.domain.services

interface TokenService {
    fun generateToken(
        username: String,
        userType: String,
        expires: Long? = null,
    ): String

    fun extractUsername(token: String): String?

    fun validateToken(token: String): Boolean

    fun invalidateToken(token: String)
}
