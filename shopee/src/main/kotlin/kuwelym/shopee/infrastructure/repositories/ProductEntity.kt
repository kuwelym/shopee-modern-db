package kuwelym.shopee.infrastructure.repositories

import kuwelym.shopee.domain.entities.Product
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.math.BigDecimal
import java.time.LocalDateTime

@Document(collection = "products")
data class ProductEntity(
    @Id val id: String? = null,
    @Indexed
    val name: String,
    val description: String,
    val price: BigDecimal,
    val stock: Int,
    @Indexed
    @Field("shop_id")
    val shopId: String,
    @Indexed
    @Field("category_id")
    val categoryId: String? = null,
    @Field("image_urls")
    val imageUrls: MutableList<String> = mutableListOf(),
    @Field("created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),
    @Field("updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    @Field("is_active")
    val isActive: Boolean = true,
)

// Extension functions for mapping between domain and infrastructure
fun Product.toEntity(): ProductEntity =
    ProductEntity(
        id = this.id,
        name = this.name,
        description = this.description,
        price = this.price,
        stock = this.stock,
        shopId = this.shopId,
        categoryId = this.categoryId,
        imageUrls = this.imageUrls,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        isActive = this.isActive,
    )

fun ProductEntity.toDomain(): Product =
    Product(
        id = this.id,
        name = this.name,
        description = this.description,
        price = this.price,
        stock = this.stock,
        shopId = this.shopId,
        categoryId = this.categoryId,
        imageUrls = this.imageUrls,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        isActive = this.isActive,
    )
