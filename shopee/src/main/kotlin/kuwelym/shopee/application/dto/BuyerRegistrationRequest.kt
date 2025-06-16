package kuwelym.shopee.application.dto

import java.time.LocalDateTime

data class BuyerRegistrationRequest(
    val username: String,
    val password: String,
    val email: String,
    val phoneNumber: String? = null,
    val fullName: String? = null,
    val dateOfBirth: LocalDateTime? = null,
    val address: String? = null,
)
