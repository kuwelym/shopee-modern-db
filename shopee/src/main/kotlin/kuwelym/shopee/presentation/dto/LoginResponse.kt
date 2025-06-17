package kuwelym.shopee.presentation.dto

data class LoginResponse(
    val token: String,
    val userType: String,
    val username: String,
)
