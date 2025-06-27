package kuwelym.shopee.domain.entities

import java.io.Serializable

data class CartItem(
    val productId: String,
    val productName: String,
    var quantity: Int,
    val price: Double,
) : Serializable
