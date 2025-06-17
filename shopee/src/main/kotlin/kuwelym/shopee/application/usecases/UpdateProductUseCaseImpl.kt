package kuwelym.shopee.application.usecases

import kuwelym.shopee.application.dto.UpdateProductRequest
import kuwelym.shopee.domain.entities.Product
import kuwelym.shopee.domain.repositories.ProductRepository
import kuwelym.shopee.domain.services.AuthenticationService
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class UpdateProductUseCaseImpl(
    private val productRepository: ProductRepository,
    private val authenticationService: AuthenticationService,
) : UpdateProductUseCase {
    override suspend fun execute(
        id: String,
        updateData: UpdateProductRequest,
    ): Result<Product> {
        return try {
            authenticationService.getCurrentShop()

            val existingProduct = productRepository.findById(id)
            if (existingProduct == null || !existingProduct.isActive) {
                return Result.failure(Exception("Product not found"))
            }

            val updatedProduct =
                existingProduct.copy(
                    name = updateData.name ?: existingProduct.name,
                    description = updateData.description ?: existingProduct.description,
                    price = updateData.price ?: existingProduct.price,
                    stock = updateData.stock ?: existingProduct.stock,
                    categoryId = updateData.categoryId ?: existingProduct.categoryId,
                    imageUrls = updateData.imageUrls?.toMutableList() ?: existingProduct.imageUrls,
                    updatedAt = LocalDateTime.now(),
                )

            val savedProduct = productRepository.save(updatedProduct)
            Result.success(savedProduct)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
