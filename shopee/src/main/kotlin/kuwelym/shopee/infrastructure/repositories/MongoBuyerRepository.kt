package kuwelym.shopee.infrastructure.repositories

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kuwelym.shopee.domain.entities.Buyer
import kuwelym.shopee.domain.repositories.BuyerRepository
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface SpringDataBuyerRepository : MongoRepository<BuyerEntity, String> {
    fun findByUsername(username: String): BuyerEntity?

    fun findByEmail(email: String): BuyerEntity?

    fun existsByUsername(username: String): Boolean

    fun existsByEmail(email: String): Boolean
}

@Repository
class MongoBuyerRepository(
    private val springDataBuyerRepository: SpringDataBuyerRepository,
) : BuyerRepository {
    override suspend fun save(buyer: Buyer): Buyer =
        withContext(Dispatchers.IO) {
            val entity = buyer.toEntity()
            val savedEntity = springDataBuyerRepository.save(entity)
            savedEntity.toDomain()
        }

    override suspend fun findById(id: String): Buyer? =
        withContext(Dispatchers.IO) {
            springDataBuyerRepository.findById(id)
                .map { it.toDomain() }
                .orElse(null)
        }

    override suspend fun findByUsername(username: String): Buyer? =
        withContext(Dispatchers.IO) {
            springDataBuyerRepository.findByUsername(username)?.toDomain()
        }

    override suspend fun findByEmail(email: String): Buyer? =
        withContext(Dispatchers.IO) {
            springDataBuyerRepository.findByEmail(email)?.toDomain()
        }

    override suspend fun existsByUsername(username: String): Boolean =
        withContext(Dispatchers.IO) {
            springDataBuyerRepository.existsByUsername(username)
        }

    override suspend fun existsByEmail(email: String): Boolean =
        withContext(Dispatchers.IO) {
            springDataBuyerRepository.existsByEmail(email)
        }

    override suspend fun delete(id: String) =
        withContext(Dispatchers.IO) {
            springDataBuyerRepository.deleteById(id)
        }

    override suspend fun findAll(): List<Buyer> =
        withContext(Dispatchers.IO) {
            springDataBuyerRepository.findAll().map { it.toDomain() }
        }
}
