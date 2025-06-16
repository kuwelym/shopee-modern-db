package kuwelym.shopee.application.dto

data class ShopRegistrationRequest(
    val username: String,
    val password: String,
    val email: String,
    val phoneNumber: String? = null,
    val businessName: String,
    val shopName: String,
    val taxCode: String,
    val businessAddress: String? = null,
    val businessDescription: String? = null,
    val businessType: String? = null,
)
