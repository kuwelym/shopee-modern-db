package kuwelym.shopee.presentation.dto

import kuwelym.shopee.domain.entities.Buyer
import java.time.LocalDateTime

data class BuyerResponse(
    val id: String?,
    val username: String,
    val email: String,
    val phoneNumber: String?,
    val fullName: String?,
    val address: String?,
    val createdAt: LocalDateTime,
    val isActive: Boolean,
)

fun Buyer.toResponse(): BuyerResponse =
    BuyerResponse(
        id = this.id,
        username = this.username,
        email = this.email,
        phoneNumber = this.phoneNumber,
        fullName = this.fullName,
        address = this.address,
        createdAt = this.createdAt,
        isActive = this.isActive,
    )
