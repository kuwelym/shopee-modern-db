package kuwelym.shopee.domain.entities

import java.io.Serializable

data class Cart(
    val userId: String,
    var items: MutableList<CartItem> = mutableListOf(),
    var totalAmount: Double = 0.0,
) : Serializable {
    init {
        calculateTotalAmount()
    }

    fun calculateTotalAmount() {
        this.totalAmount = items.sumOf { it.quantity * it.price }
    }

    fun addItem(newItem: CartItem) {
        val existingItem = items.find { it.productId == newItem.productId }
        if (existingItem != null) {
            existingItem.quantity += newItem.quantity
        } else {
            items.add(newItem)
        }
        calculateTotalAmount() // Cập nhật lại tổng tiền sau khi thêm/cập nhật
    }

    fun removeItem(productId: Long) {
        items.removeIf { it.productId == productId }
        calculateTotalAmount()
    }

    fun updateItemQuantity(
        productId: Long,
        newQuantity: Int,
    ) {
        if (newQuantity <= 0) {
            removeItem(productId)
            return
        }
        items.find { it.productId == productId }?.let { item ->
            item.quantity = newQuantity
        }
        calculateTotalAmount()
    }
}
