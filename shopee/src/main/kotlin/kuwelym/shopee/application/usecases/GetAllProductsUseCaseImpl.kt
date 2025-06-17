package kuwelym.shopee.application.usecases

import kuwelym.shopee.domain.entities.Product
import kuwelym.shopee.domain.repositories.ProductRepository
import org.springframework.stereotype.Service

@Service
class GetAllProductsUseCaseImpl(
    private val productRepository: ProductRepository,
) : GetAllProductsUseCase {
    override suspend fun execute(): Result<List<Product>> {
        return try {
            val products = productRepository.findActiveProducts()
            Result.success(products)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
