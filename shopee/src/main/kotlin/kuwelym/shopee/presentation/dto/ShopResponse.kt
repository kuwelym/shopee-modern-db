package kuwelym.shopee.presentation.dto

import kuwelym.shopee.domain.entities.Shop
import java.time.LocalDateTime

data class ShopResponse(
    val id: String?,
    val username: String,
    val email: String,
    val phoneNumber: String?,
    val businessName: String,
    val shopName: String,
    val taxCode: String,
    val businessAddress: String?,
    val businessDescription: String?,
    val businessType: String?,
    val createdAt: LocalDateTime,
    val isActive: Boolean,
)

fun Shop.toResponse(): ShopResponse =
    ShopResponse(
        id = this.id,
        username = this.username,
        email = this.email,
        phoneNumber = this.phoneNumber,
        businessName = this.businessName,
        shopName = this.shopName,
        taxCode = this.taxCode,
        businessAddress = this.businessAddress,
        businessDescription = this.businessDescription,
        businessType = this.businessType,
        createdAt = this.createdAt,
        isActive = this.isActive,
    )
