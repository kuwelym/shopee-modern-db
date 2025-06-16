package kuwelym.shopee.infrastructure.repositories

import kuwelym.shopee.domain.entities.Buyer
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.time.LocalDateTime

@Document(collection = "buyers")
data class BuyerEntity(
    @Id val id: String? = null,
    @Indexed(unique = true)
    val username: String,
    val password: String,
    @Indexed(unique = true)
    val email: String,
    @Field("phone_number")
    val phoneNumber: String? = null,
    @Field("full_name")
    val fullName: String? = null,
    @Field("date_of_birth")
    val dateOfBirth: LocalDateTime? = null,
    val address: String? = null,
    @Field("created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    @Field("updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    @Field("is_active")
    val isActive: Boolean = true,
)

// Extension functions for mapping between domain and infrastructure
fun Buyer.toEntity(): BuyerEntity =
    BuyerEntity(
        id = this.id,
        username = this.username,
        password = this.password,
        email = this.email,
        phoneNumber = this.phoneNumber,
        fullName = this.fullName,
        dateOfBirth = this.dateOfBirth,
        address = this.address,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        isActive = this.isActive,
    )

fun BuyerEntity.toDomain(): Buyer =
    Buyer(
        id = this.id,
        username = this.username,
        password = this.password,
        email = this.email,
        phoneNumber = this.phoneNumber,
        fullName = this.fullName,
        dateOfBirth = this.dateOfBirth,
        address = this.address,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        isActive = this.isActive,
    )
