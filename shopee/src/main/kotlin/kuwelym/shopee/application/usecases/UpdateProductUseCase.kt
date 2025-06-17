package kuwelym.shopee.application.usecases

import kuwelym.shopee.application.dto.UpdateProductRequest
import kuwelym.shopee.domain.entities.Product

interface UpdateProductUseCase {
    suspend fun execute(
        id: String,
        updateData: UpdateProductRequest,
    ): Result<Product>
}
