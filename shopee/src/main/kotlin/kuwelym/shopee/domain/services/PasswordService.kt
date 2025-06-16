package kuwelym.shopee.domain.services

interface PasswordService {
    fun encode(rawPassword: String): String

    fun matches(
        rawPassword: String,
        encodedPassword: String,
    ): Boolean
}
