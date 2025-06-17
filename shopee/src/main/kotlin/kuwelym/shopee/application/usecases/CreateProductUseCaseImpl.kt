package kuwelym.shopee.application.usecases

import kuwelym.shopee.application.dto.CreateProductRequest
import kuwelym.shopee.domain.entities.Product
import kuwelym.shopee.domain.repositories.ProductRepository
import kuwelym.shopee.domain.services.AuthenticationService
import org.springframework.stereotype.Service

@Service
class CreateProductUseCaseImpl(
    private val productRepository: ProductRepository,
    private val authenticationService: AuthenticationService,
) : CreateProductUseCase {
    override suspend fun execute(request: CreateProductRequest): Result<Product> {
        return try {
            // Get the current authenticated shop
            val shop = authenticationService.getCurrentShop()

            // Verify shop is active
            if (!shop.isActive) {
                return Result.failure(Exception("Shop is inactive"))
            }

            val product =
                Product(
                    name = request.name,
                    description = request.description,
                    price = request.price,
                    stock = request.stock,
                    shopId = shop.id,
                    categoryId = request.categoryId,
                    imageUrls = request.imageUrls.toMutableList(),
                )

            val savedProduct = productRepository.save(product)
            Result.success(savedProduct)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
