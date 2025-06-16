package kuwelym.shopee.domain.entities

import java.time.LocalDateTime

data class Shop(
    override val id: String? = null,
    override val username: String,
    override val password: String,
    override val email: String,
    override val phoneNumber: String? = null,
    override val createdAt: LocalDateTime = LocalDateTime.now(),
    override val updatedAt: LocalDateTime = LocalDateTime.now(),
    override val isActive: Boolean = true,
    val businessName: String,
    val shopName: String,
    val taxCode: String,
    val businessAddress: String? = null,
    val businessDescription: String? = null,
    val businessType: String? = null,
) : User(id, username, password, email, phoneNumber, createdAt, updatedAt, isActive) {
    fun isValidTaxCode(): Boolean = taxCode.isNotBlank() && taxCode.length >= 6

    fun isValidBusinessName(): Boolean = businessName.isNotBlank()

    fun isValidShopName(): Boolean = shopName.isNotBlank()

    fun isValidForRegistration(): Boolean =
        isValidEmail() &&
            isValidUsername() &&
            isValidPassword() &&
            isValidTaxCode() &&
            isValidBusinessName() &&
            isValidShopName()
}
