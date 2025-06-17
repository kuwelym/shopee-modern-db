package kuwelym.shopee.application.usecases

import kuwelym.shopee.domain.entities.Product

interface GetProductByIdUseCase {
    suspend fun execute(id: String): Result<Product>
}
