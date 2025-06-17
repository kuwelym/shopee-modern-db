package kuwelym.shopee.application.dto

import java.math.BigDecimal

data class CreateProductRequest(
    val name: String,
    val description: String,
    val price: BigDecimal,
    val stock: Int,
    val categoryId: String? = null,
    val imageUrls: List<String> = emptyList(),
)

data class UpdateProductRequest(
    val name: String? = null,
    val description: String? = null,
    val price: BigDecimal? = null,
    val stock: Int? = null,
    val categoryId: String? = null,
    val imageUrls: List<String>? = null,
)
