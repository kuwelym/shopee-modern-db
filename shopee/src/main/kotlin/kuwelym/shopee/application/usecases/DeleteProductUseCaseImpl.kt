package kuwelym.shopee.application.usecases

import kuwelym.shopee.domain.repositories.ProductRepository
import kuwelym.shopee.domain.services.AuthenticationService
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class DeleteProductUseCaseImpl(
    private val productRepository: ProductRepository,
    private val authenticationService: AuthenticationService,
) : DeleteProductUseCase {
    override suspend fun execute(id: String): Result<String> {
        return try {
            val existingProduct = productRepository.findById(id)
            if (existingProduct == null || !existingProduct.isActive) {
                return Result.failure(Exception("Product not found"))
            }

            // Get the current authenticated shop
            val shop = authenticationService.getCurrentShop()

            // Check if the product belongs to the authenticated shop
            if (existingProduct.shopId != shop.id) {
                return Result.failure(Exception("Unauthorized: You can only delete your own products"))
            }

            // Soft delete by setting isActive to false
            val deactivatedProduct =
                existingProduct.copy(
                    isActive = false,
                    updatedAt = LocalDateTime.now(),
                )
            productRepository.save(deactivatedProduct)
            Result.success("Product deleted successfully")
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
