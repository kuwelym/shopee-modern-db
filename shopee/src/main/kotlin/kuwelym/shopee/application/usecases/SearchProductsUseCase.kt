package kuwelym.shopee.application.usecases

import kuwelym.shopee.domain.entities.Product

interface SearchProductsUseCase {
    suspend fun execute(query: String): Result<List<Product>>
}
