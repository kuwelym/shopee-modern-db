package kuwelym.shopee.application.usecases

import kuwelym.shopee.application.dto.LoginRequest
import kuwelym.shopee.domain.repositories.BuyerRepository
import kuwelym.shopee.domain.repositories.ShopRepository
import kuwelym.shopee.domain.services.PasswordService
import kuwelym.shopee.domain.services.TokenService
import kuwelym.shopee.presentation.dto.LoginResponse
import org.springframework.stereotype.Service

@Service
class AuthenticateUserUseCaseImpl(
    private val buyerRepository: BuyerRepository,
    private val shopRepository: ShopRepository,
    private val passwordService: PasswordService,
    private val tokenService: TokenService,
) : AuthenticateUserUseCase {
    override suspend fun execute(request: LoginRequest): Result<LoginResponse> {
        return try {
            // Check if it's a buyer first
            val buyer = buyerRepository.findByUsername(request.username)
            if (buyer != null) {
                if (passwordService.matches(request.password, buyer.password)) {
                    val token = tokenService.generateToken(buyer.username, "BUYER")
                    return Result.success(
                        LoginResponse(
                            token = token,
                            userType = "BUYER",
                            username = buyer.username,
                        ),
                    )
                } else {
                    return Result.failure(IllegalArgumentException("Invalid credentials"))
                }
            }

            // Check if it's a shop
            val shop = shopRepository.findByUsername(request.username)
            if (shop != null) {
                if (passwordService.matches(request.password, shop.password)) {
                    val token = tokenService.generateToken(shop.username, "SHOP")
                    return Result.success(
                        LoginResponse(
                            token = token,
                            userType = "SHOP",
                            username = shop.username,
                        ),
                    )
                } else {
                    return Result.failure(IllegalArgumentException("Invalid credentials"))
                }
            }

            Result.failure(IllegalArgumentException("Invalid credentials"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
