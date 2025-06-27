package kuwelym.shopee.domain.entities

import java.io.Serializable
import java.util.Collections

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
    
    fun clearCart() {
        items.clear()
        totalAmount = 0.0
    }

    fun addItem(newItem: CartItem) {
        val existingItem = items.find { it.productId == newItem.productId }
        if (existingItem != null) {
            existingItem.quantity += newItem.quantity
        } else {
            items.add(newItem)
        }
        calculateTotalAmount()
    }

    fun removeItem(productId: String) {
        val initialSize = items.size
        items.removeIf { it.productId == productId }
        if (items.size < initialSize) {
            calculateTotalAmount()
        }
    }

    fun updateItemQuantity(productId: String, newQuantity: Int) {
        val existingItem = items.find { it.productId == productId }
        if (existingItem != null) {
            if (newQuantity <= 0) {
                items.remove(existingItem)
            } else {
                existingItem.quantity = newQuantity
            }
            calculateTotalAmount()
        }
    }
}
