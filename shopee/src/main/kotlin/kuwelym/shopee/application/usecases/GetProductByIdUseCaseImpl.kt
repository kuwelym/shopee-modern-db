package kuwelym.shopee.application.usecases

import kuwelym.shopee.domain.entities.Product
import kuwelym.shopee.domain.repositories.ProductRepository
import org.springframework.stereotype.Service

@Service
class GetProductByIdUseCaseImpl(
    private val productRepository: ProductRepository,
) : GetProductByIdUseCase {
    override suspend fun execute(id: String): Result<Product> {
        return try {
            val product = productRepository.findById(id)
            if (product != null && product.isActive) {
                Result.success(product)
            } else {
                Result.failure(Exception("Product not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
