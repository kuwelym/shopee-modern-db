package kuwelym.shopee.infrastructure.repositories

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kuwelym.shopee.domain.entities.Shop
import kuwelym.shopee.domain.repositories.ShopRepository
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface SpringDataShopRepository : MongoRepository<ShopEntity, String> {
    fun findByUsername(username: String): ShopEntity?

    fun findByEmail(email: String): ShopEntity?

    fun findByTaxCode(taxCode: String): ShopEntity?

    fun findByShopName(shopName: String): ShopEntity?

    fun existsByUsername(username: String): Boolean

    fun existsByEmail(email: String): Boolean

    fun existsByTaxCode(taxCode: String): Boolean

    fun existsByShopName(shopName: String): Boolean

    fun findByBusinessType(businessType: String): List<ShopEntity>
}

@Repository
class MongoShopRepository(
    private val springDataShopRepository: SpringDataShopRepository,
) : ShopRepository {
    override suspend fun save(shop: Shop): Shop =
        withContext(Dispatchers.IO) {
            val entity = shop.toEntity()
            val savedEntity = springDataShopRepository.save(entity)
            savedEntity.toDomain()
        }

    override suspend fun findById(id: String): Shop? =
        withContext(Dispatchers.IO) {
            springDataShopRepository.findById(id)
                .map { it.toDomain() }
                .orElse(null)
        }

    override suspend fun findByUsername(username: String): Shop? =
        withContext(Dispatchers.IO) {
            springDataShopRepository.findByUsername(username)?.toDomain()
        }

    override suspend fun findByEmail(email: String): Shop? =
        withContext(Dispatchers.IO) {
            springDataShopRepository.findByEmail(email)?.toDomain()
        }

    override suspend fun findByTaxCode(taxCode: String): Shop? =
        withContext(Dispatchers.IO) {
            springDataShopRepository.findByTaxCode(taxCode)?.toDomain()
        }

    override suspend fun findByShopName(shopName: String): Shop? =
        withContext(Dispatchers.IO) {
            springDataShopRepository.findByShopName(shopName)?.toDomain()
        }

    override suspend fun existsByUsername(username: String): Boolean =
        withContext(Dispatchers.IO) {
            springDataShopRepository.existsByUsername(username)
        }

    override suspend fun existsByEmail(email: String): Boolean =
        withContext(Dispatchers.IO) {
            springDataShopRepository.existsByEmail(email)
        }

    override suspend fun existsByTaxCode(taxCode: String): Boolean =
        withContext(Dispatchers.IO) {
            springDataShopRepository.existsByTaxCode(taxCode)
        }

    override suspend fun existsByShopName(shopName: String): Boolean =
        withContext(Dispatchers.IO) {
            springDataShopRepository.existsByShopName(shopName)
        }

    override suspend fun delete(id: String) =
        withContext(Dispatchers.IO) {
            springDataShopRepository.deleteById(id)
        }

    override suspend fun findAll(): List<Shop> =
        withContext(Dispatchers.IO) {
            springDataShopRepository.findAll().map { it.toDomain() }
        }

    override suspend fun findByBusinessType(businessType: String): List<Shop> =
        withContext(Dispatchers.IO) {
            springDataShopRepository.findByBusinessType(businessType).map { it.toDomain() }
        }
}
