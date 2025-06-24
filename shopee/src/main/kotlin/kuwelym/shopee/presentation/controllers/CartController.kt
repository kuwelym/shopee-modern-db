package kuwelym.shopee.presentation.controllers

import kuwelym.shopee.domain.entities.Cart
import kuwelym.shopee.services.CartService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.slf4j.LoggerFactory
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = ["http://localhost:3000", "http://127.0.0.1:3000"])
class CartController(
    private val cartService: CartService
) {
    private val logger = LoggerFactory.getLogger(CartController::class.java)

    // DTO cho request thêm/cập nhật sản phẩm vào giỏ
    data class AddItemRequest(
        val productId: Long,
        val productName: String?,
        val quantity: Int,
        val price: Double?
    )

    // Lấy userId
    private fun getCurrentUserId(): String {
    val authentication: Authentication = SecurityContextHolder.getContext().authentication
    val userId = authentication.name
    if (userId == "anonymousUser" || authentication.principal == "anonymousUser") {
        logger.warn("Attempt to access cart with anonymous user. This endpoint requires authentication.")
        throw IllegalStateException("User not authenticated.")
    }
    return userId
}
   

    // Lấy giỏ hàng của người dùng hiện tại
    @GetMapping
    fun getCartForCurrentUser(): ResponseEntity<Cart> {
        val userId = getCurrentUserId()
        logger.info("GET /api/cart request for user: $userId")
        val cart = cartService.getCart(userId)
        return ResponseEntity.ok(cart)
    }

    // Thêm sản phẩm vào giỏ hàng hoặc cập nhật số lượng
    @PostMapping("/add")
    fun addItemToCart(@RequestBody request: AddItemRequest): ResponseEntity<Cart> {
        val userId = getCurrentUserId()
        logger.info("POST /api/cart/add request for user: $userId, product: ${request.productId}")

        val productName = request.productName ?: throw IllegalArgumentException("Product name is required for adding item.")
        val price = request.price ?: throw IllegalArgumentException("Price is required for adding item.")

        val cart = cartService.addItemToCart(
            userId,
            request.productId,
            productName,
            request.quantity,
            price
        )
        return ResponseEntity.ok(cart)
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @PutMapping("/update-quantity")
    fun updateItemQuantity(@RequestBody request: AddItemRequest): ResponseEntity<Cart> {
        val userId = getCurrentUserId()
        logger.info("PUT /api/cart/update-quantity request for user: $userId, product: ${request.productId}, new quantity: ${request.quantity}")
        val cart = cartService.updateCartItemQuantity(userId, request.productId, request.quantity)
        return ResponseEntity.ok(cart)
    }

    // Xóa sản phẩm khỏi giỏ hàng
    @DeleteMapping("/remove/{productId}")
    fun removeItemFromCart(@PathVariable productId: Long): ResponseEntity<Cart> {
        val userId = getCurrentUserId()
        logger.info("DELETE /api/cart/remove/${productId} request for user: $userId")
        val cart = cartService.removeItemFromCart(userId, productId)
        return ResponseEntity.ok(cart)
    }

    // Xóa toàn bộ giỏ hàng
    @DeleteMapping("/clear")
    fun clearCart(): ResponseEntity<Void> {
        val userId = getCurrentUserId()
        logger.info("DELETE /api/cart/clear request for user: $userId")
        cartService.clearCart(userId)
        return ResponseEntity.noContent().build()
    }
}