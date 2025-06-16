package kuwelym.shopee.application.dto

data class LoginRequest(
    val username: String,
    val password: String,
)

data class LoginResponse(
    val token: String,
    val userType: String,
    val username: String,
)
