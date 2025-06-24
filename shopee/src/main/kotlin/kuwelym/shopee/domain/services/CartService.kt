package kuwelym.shopee.domain.services

import kuwelym.shopee.domain.entities.Cart
import kuwelym.shopee.domain.entities.CartItem
import org.slf4j.LoggerFactory
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import java.time.Duration

@Service
class CartService(
    private val redisTemplate: RedisTemplate<String, Any>,
) {
    private val logger = LoggerFactory.getLogger(CartService::class.java)

    companion object {
        private const val CART_KEY_PREFIX = "cart:" // Prefix for Redis keys
    }

    // Lấy giỏ hàng từ Redis
    fun getCart(userId: String): Cart {
        val cartKey = "$CART_KEY_PREFIX$userId"
        val cartObject = redisTemplate.opsForValue().get(cartKey)

        return if (cartObject is Cart) {
            logger.info("Cart for user $userId retrieved from Redis.")
            cartObject
        } else {
            logger.info("No cart found for user $userId in Redis. Creating new cart.")
            Cart(userId)
        }
    }

    // Lưu giỏ hàng vào Redis
    fun saveCart(cart: Cart) {
        val cartKey = "$CART_KEY_PREFIX${cart.userId}"
        redisTemplate.opsForValue().set(cartKey, cart)
        redisTemplate.expire(cartKey, Duration.ofHours(1))
        logger.info("Cart for user ${cart.userId} saved to Redis with expiry.")
    }

    // Thêm sản phẩm vào giỏ hàng
    fun addItemToCart(
        userId: String,
        productId: Long,
        productName: String,
        quantity: Int,
        price: Double,
    ): Cart {
        val cart = getCart(userId)
        val newItem = CartItem(productId, productName, quantity, price)
        cart.addItem(newItem)
        saveCart(cart)
        logger.info("Added item ${newItem.productId} to cart for user $userId. New quantity: ${newItem.quantity}")
        return cart
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    fun updateCartItemQuantity(
        userId: String,
        productId: Long,
        newQuantity: Int,
    ): Cart {
        val cart = getCart(userId)
        cart.updateItemQuantity(productId, newQuantity)
        saveCart(cart)
        logger.info("Updated quantity for item $productId in cart for user $userId to $newQuantity.")
        return cart
    }

    // Xóa sản phẩm khỏi giỏ hàng
    fun removeItemFromCart(
        userId: String,
        productId: Long,
    ): Cart {
        val cart = getCart(userId)
        cart.removeItem(productId)
        saveCart(cart)
        logger.info("Removed item $productId from cart for user $userId.")
        return cart
    }

    // Xóa toàn bộ giỏ hàng khỏi Redis
    fun clearCart(userId: String) {
        val cartKey = "$CART_KEY_PREFIX$userId"
        redisTemplate.delete(cartKey)
        logger.info("Cart for user $userId cleared from Redis.")
    }
}
