package kuwelym.shopee.application.usecases

import kuwelym.shopee.domain.entities.Product
import kuwelym.shopee.domain.repositories.ProductRepository
import kuwelym.shopee.domain.services.AuthenticationService
import org.springframework.stereotype.Service

@Service
class GetProductsByShopUseCaseImpl(
    private val productRepository: ProductRepository,
    private val authenticationService: AuthenticationService,
) : GetProductsByShopUseCase {
    override suspend fun execute(): Result<List<Product>> {
        return try {
            // Get the current authenticated shop
            val shop = authenticationService.getCurrentShop()
            val products = productRepository.findByShopId(shop.id).filter { it.isActive }
            Result.success(products)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
