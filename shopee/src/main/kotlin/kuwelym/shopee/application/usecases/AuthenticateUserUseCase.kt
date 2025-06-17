package kuwelym.shopee.application.usecases

import kuwelym.shopee.application.dto.LoginRequest
import kuwelym.shopee.presentation.dto.LoginResponse

interface AuthenticateUserUseCase {
    suspend fun execute(request: LoginRequest): Result<LoginResponse>
}
