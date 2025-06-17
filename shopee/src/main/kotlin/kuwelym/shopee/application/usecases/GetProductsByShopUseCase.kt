package kuwelym.shopee.application.usecases

import kuwelym.shopee.domain.entities.Product

interface GetProductsByShopUseCase {
    suspend fun execute(): Result<List<Product>>
}
