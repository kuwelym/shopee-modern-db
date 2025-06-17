package kuwelym.shopee.presentation.dto

import kuwelym.shopee.domain.entities.Product
import java.math.BigDecimal
import java.time.LocalDateTime

data class ProductResponse(
    val id: String?,
    val name: String,
    val description: String,
    val price: BigDecimal,
    val stock: Int,
    val shopId: String,
    val categoryId: String?,
    val imageUrls: List<String>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val isActive: Boolean,
)

fun Product.toResponse(): ProductResponse =
    ProductResponse(
        id = this.id,
        name = this.name,
        description = this.description,
        price = this.price,
        stock = this.stock,
        shopId = this.shopId,
        categoryId = this.categoryId,
        imageUrls = this.imageUrls.toList(),
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        isActive = this.isActive,
    )
