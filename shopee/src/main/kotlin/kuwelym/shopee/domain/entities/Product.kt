package kuwelym.shopee.domain.entities

import java.math.BigDecimal
import java.time.LocalDateTime

data class Product(
    val id: String? = null,
    val name: String,
    val description: String,
    val price: BigDecimal,
    val stock: Int,
    val shopId: String,
    val categoryId: String? = null,
    val imageUrls: MutableList<String> = mutableListOf(),
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    val isActive: Boolean = true,
) {
    fun isValidPrice(): Boolean = price > BigDecimal.ZERO

    fun isInStock(): Boolean = stock > 0

    fun hasEnoughStock(quantity: Int): Boolean = stock >= quantity

    fun reduceStock(quantity: Int): Product {
        require(hasEnoughStock(quantity)) { "Insufficient stock" }
        return this.copy(stock = stock - quantity)
    }

    fun addStock(quantity: Int): Product {
        require(quantity > 0) { "Quantity must be positive" }
        return this.copy(stock = stock + quantity)
    }

    fun updatePrice(newPrice: BigDecimal): Product {
        require(newPrice > BigDecimal.ZERO) { "Price must be positive" }
        return this.copy(price = newPrice, updatedAt = LocalDateTime.now())
    }
}
