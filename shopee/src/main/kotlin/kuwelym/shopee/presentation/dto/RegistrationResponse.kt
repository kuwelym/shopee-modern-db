package kuwelym.shopee.presentation.dto

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

data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T? = null,
)
