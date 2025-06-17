package kuwelym.shopee.infrastructure.repositories

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kuwelym.shopee.domain.entities.Product
import kuwelym.shopee.domain.repositories.ProductRepository
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface SpringDataProductRepository : MongoRepository<ProductEntity, String> {
    fun findByShopId(shopId: String): List<ProductEntity>

    fun findByCategoryId(categoryId: String): List<ProductEntity>

    fun findByName(name: String): List<ProductEntity>

    @Query("{ 'isActive': true }")
    fun findActiveProducts(): List<ProductEntity>

    @Query("{ 'isActive': true, 'stock': { \$gt: 0 } }")
    fun findInStockProducts(): List<ProductEntity>

    @Query("{ 'name': { \$regex: ?0, \$options: 'i' }, 'isActive': true }")
    fun searchByNameContaining(query: String): List<ProductEntity>
}

@Repository
class MongoProductRepository(
    private val springDataProductRepository: SpringDataProductRepository,
) : ProductRepository {
    override suspend fun save(product: Product): Product =
        withContext(Dispatchers.IO) {
            val entity = product.toEntity()
            val savedEntity = springDataProductRepository.save(entity)
            savedEntity.toDomain()
        }

    override suspend fun findById(id: String): Product? =
        withContext(Dispatchers.IO) {
            springDataProductRepository.findById(id)
                .map { it.toDomain() }
                .orElse(null)
        }

    override suspend fun findByShopId(shopId: String): List<Product> =
        withContext(Dispatchers.IO) {
            springDataProductRepository.findByShopId(shopId).map { it.toDomain() }
        }

    override suspend fun findByCategoryId(categoryId: String): List<Product> =
        withContext(Dispatchers.IO) {
            springDataProductRepository.findByCategoryId(categoryId).map { it.toDomain() }
        }

    override suspend fun findByName(name: String): List<Product> =
        withContext(Dispatchers.IO) {
            springDataProductRepository.findByName(name).map { it.toDomain() }
        }

    override suspend fun findAll(): List<Product> =
        withContext(Dispatchers.IO) {
            springDataProductRepository.findAll().map { it.toDomain() }
        }

    override suspend fun findActiveProducts(): List<Product> =
        withContext(Dispatchers.IO) {
            springDataProductRepository.findActiveProducts().map { it.toDomain() }
        }

    override suspend fun findInStockProducts(): List<Product> =
        withContext(Dispatchers.IO) {
            springDataProductRepository.findInStockProducts().map { it.toDomain() }
        }

    override suspend fun delete(id: String) =
        withContext(Dispatchers.IO) {
            springDataProductRepository.deleteById(id)
        }

    override suspend fun searchByNameContaining(query: String): List<Product> =
        withContext(Dispatchers.IO) {
            springDataProductRepository.searchByNameContaining(query).map { it.toDomain() }
        }
}
