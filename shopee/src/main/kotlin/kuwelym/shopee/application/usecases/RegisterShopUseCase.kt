package kuwelym.shopee.application.usecases

import kuwelym.shopee.application.dto.ShopRegistrationRequest
import kuwelym.shopee.domain.entities.Shop

interface RegisterShopUseCase {
    suspend fun execute(request: ShopRegistrationRequest): Result<Shop>
}
