package kuwelym.shopee.infrastructure.repositories

import kuwelym.shopee.domain.entities.Shop
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.time.LocalDateTime

@Document(collection = "shops")
data class ShopEntity(
    @Id val id: String,
    @Indexed(unique = true)
    val username: String,
    val password: String,
    @Indexed(unique = true)
    val email: String,
    @Field("phone_number")
    val phoneNumber: String? = null,
    @Field("business_name")
    val businessName: String,
    @Indexed(unique = true)
    @Field("shop_name")
    val shopName: String,
    @Indexed(unique = true)
    @Field("tax_code")
    val taxCode: String,
    @Field("business_address")
    val businessAddress: String? = null,
    @Field("business_description")
    val businessDescription: String? = null,
    @Field("business_type")
    val businessType: String? = null,
    @Field("created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    @Field("updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    @Field("is_active")
    val isActive: Boolean = true,
)

fun Shop.toEntity(): ShopEntity =
    ShopEntity(
        id = this.id,
        username = this.username,
        password = this.password,
        email = this.email,
        phoneNumber = this.phoneNumber,
        businessName = this.businessName,
        shopName = this.shopName,
        taxCode = this.taxCode,
        businessAddress = this.businessAddress,
        businessDescription = this.businessDescription,
        businessType = this.businessType,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        isActive = this.isActive,
    )

fun ShopEntity.toDomain(): Shop =
    Shop(
        id = this.id,
        username = this.username,
        password = this.password,
        email = this.email,
        phoneNumber = this.phoneNumber,
        businessName = this.businessName,
        shopName = this.shopName,
        taxCode = this.taxCode,
        businessAddress = this.businessAddress,
        businessDescription = this.businessDescription,
        businessType = this.businessType,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        isActive = this.isActive,
    )
