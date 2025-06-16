package kuwelym.shopee.presentation.controllers

import kuwelym.shopee.application.dto.BuyerRegistrationRequest
import kuwelym.shopee.application.dto.LoginRequest
import kuwelym.shopee.application.dto.ShopRegistrationRequest
import kuwelym.shopee.application.usecases.AuthenticateUserUseCase
import kuwelym.shopee.application.usecases.RegisterBuyerUseCase
import kuwelym.shopee.application.usecases.RegisterShopUseCase
import kuwelym.shopee.domain.entities.Buyer
import kuwelym.shopee.domain.entities.Shop
import kuwelym.shopee.presentation.dto.ApiResponse
import kuwelym.shopee.presentation.dto.BuyerResponse
import kuwelym.shopee.presentation.dto.ShopResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
class AuthController(
    private val registerBuyerUseCase: RegisterBuyerUseCase,
    private val registerShopUseCase: RegisterShopUseCase,
    private val authenticateUserUseCase: AuthenticateUserUseCase,
) {
    @PostMapping("/register/buyer")
    suspend fun registerBuyer(
        @RequestBody request: BuyerRegistrationRequest,
    ): ResponseEntity<ApiResponse<BuyerResponse>> {
        return registerBuyerUseCase.execute(request)
            .fold(
                onSuccess = { buyer ->
                    ResponseEntity.ok(
                        ApiResponse(
                            success = true,
                            message = "Buyer registered successfully",
                            data = buyer.toResponse(),
                        ),
                    )
                },
                onFailure = { error ->
                    ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        ApiResponse(
                            success = false,
                            message = error.message ?: "Registration failed",
                        ),
                    )
                },
            )
    }

    @PostMapping("/register/shop")
    suspend fun registerShop(
        @RequestBody request: ShopRegistrationRequest,
    ): ResponseEntity<ApiResponse<ShopResponse>> {
        return registerShopUseCase.execute(request)
            .fold(
                onSuccess = { shop ->
                    ResponseEntity.ok(
                        ApiResponse(
                            success = true,
                            message = "Shop registered successfully",
                            data = shop.toResponse(),
                        ),
                    )
                },
                onFailure = { error ->
                    ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        ApiResponse(
                            success = false,
                            message = error.message ?: "Registration failed",
                        ),
                    )
                },
            )
    }

    @PostMapping("/login")
    suspend fun login(
        @RequestBody request: LoginRequest,
    ): ResponseEntity<ApiResponse<Any>> {
        return authenticateUserUseCase.execute(request)
            .fold(
                onSuccess = { loginResponse ->
                    ResponseEntity.ok(
                        ApiResponse(
                            success = true,
                            message = "Login successful",
                            data = loginResponse,
                        ),
                    )
                },
                onFailure = { error ->
                    ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        ApiResponse(
                            success = false,
                            message = error.message ?: "Authentication failed",
                        ),
                    )
                },
            )
    }
}

// Extension functions to map domain entities to presentation DTOs
fun Buyer.toResponse(): BuyerResponse =
    BuyerResponse(
        id = this.id,
        username = this.username,
        email = this.email,
        phoneNumber = this.phoneNumber,
        fullName = this.fullName,
        address = this.address,
        createdAt = this.createdAt,
        isActive = this.isActive,
    )

fun Shop.toResponse(): ShopResponse =
    ShopResponse(
        id = this.id,
        username = this.username,
        email = this.email,
        phoneNumber = this.phoneNumber,
        businessName = this.businessName,
        shopName = this.shopName,
        taxCode = this.taxCode,
        businessAddress = this.businessAddress,
        businessDescription = this.businessDescription,
        businessType = this.businessType,
        createdAt = this.createdAt,
        isActive = this.isActive,
    )
