package kuwelym.shopee.application.usecases

import kuwelym.shopee.domain.entities.Product
import kuwelym.shopee.domain.repositories.ProductRepository
import org.springframework.stereotype.Service

@Service
class SearchProductsUseCaseImpl(
    private val productRepository: ProductRepository,
) : SearchProductsUseCase {
    override suspend fun execute(query: String): Result<List<Product>> {
        return try {
            val products = productRepository.searchByNameContaining(query).filter { it.isActive }
            Result.success(products)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
