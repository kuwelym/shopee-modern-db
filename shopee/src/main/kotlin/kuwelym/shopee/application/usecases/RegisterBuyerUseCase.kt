package kuwelym.shopee.application.usecases

import kuwelym.shopee.application.dto.BuyerRegistrationRequest
import kuwelym.shopee.domain.entities.Buyer
import kuwelym.shopee.domain.repositories.BuyerRepository
import kuwelym.shopee.domain.services.PasswordService
import org.springframework.stereotype.Service

interface RegisterBuyerUseCase {
    suspend fun execute(request: BuyerRegistrationRequest): Result<Buyer>
}

@Service
class RegisterBuyerUseCaseImpl(
    private val buyerRepository: BuyerRepository,
    private val passwordService: PasswordService,
) : RegisterBuyerUseCase {
    override suspend fun execute(request: BuyerRegistrationRequest): Result<Buyer> {
        return try {
            // Validate request
            validateRegistrationRequest(request)

            // Check if user already exists
            if (buyerRepository.existsByUsername(request.username)) {
                return Result.failure(IllegalArgumentException("Username already exists"))
            }

            if (buyerRepository.existsByEmail(request.email)) {
                return Result.failure(IllegalArgumentException("Email already exists"))
            }

            // Create buyer entity
            val buyer =
                Buyer(
                    username = request.username,
                    password = passwordService.encode(request.password),
                    email = request.email,
                    phoneNumber = request.phoneNumber,
                    fullName = request.fullName,
                    dateOfBirth = request.dateOfBirth,
                    address = request.address,
                )

            // Validate domain business rules
            if (!buyer.isValidEmail()) {
                return Result.failure(IllegalArgumentException("Invalid email format"))
            }

            if (!buyer.isValidUsername()) {
                return Result.failure(IllegalArgumentException("Invalid username"))
            }

            if (!buyer.isValidPassword()) {
                return Result.failure(IllegalArgumentException("Password must be at least 6 characters"))
            }

            // Save to repository
            val savedBuyer = buyerRepository.save(buyer)
            Result.success(savedBuyer)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun validateRegistrationRequest(request: BuyerRegistrationRequest) {
        require(request.username.isNotBlank()) { "Username cannot be blank" }
        require(request.password.isNotBlank()) { "Password cannot be blank" }
        require(request.email.isNotBlank()) { "Email cannot be blank" }
    }
}
