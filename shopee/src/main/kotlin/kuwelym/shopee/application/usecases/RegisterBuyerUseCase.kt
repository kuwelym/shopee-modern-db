package kuwelym.shopee.application.usecases

import kuwelym.shopee.application.dto.BuyerRegistrationRequest
import kuwelym.shopee.domain.entities.Buyer

interface RegisterBuyerUseCase {
    suspend fun execute(request: BuyerRegistrationRequest): Result<Buyer>
}
