package kuwelym.shopee.domain.repositories

import kuwelym.shopee.domain.entities.Buyer

interface BuyerRepository {
    suspend fun save(buyer: Buyer): Buyer

    suspend fun findById(id: String): Buyer?

    suspend fun findByUsername(username: String): Buyer?

    suspend fun findByEmail(email: String): Buyer?

    suspend fun existsByUsername(username: String): Boolean

    suspend fun existsByEmail(email: String): Boolean

    suspend fun delete(id: String)

    suspend fun findAll(): List<Buyer>
}
