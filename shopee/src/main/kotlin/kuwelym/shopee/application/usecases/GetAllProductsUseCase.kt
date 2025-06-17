package kuwelym.shopee.application.usecases

import kuwelym.shopee.domain.entities.Product

interface GetAllProductsUseCase {
    suspend fun execute(): Result<List<Product>>
}
