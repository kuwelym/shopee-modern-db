package kuwelym.shopee.application.usecases

import kuwelym.shopee.application.dto.CreateProductRequest
import kuwelym.shopee.domain.entities.Product

interface CreateProductUseCase {
    suspend fun execute(request: CreateProductRequest): Result<Product>
}
