package kuwelym.shopee.domain.repositories

import kuwelym.shopee.domain.entities.Shop

interface ShopRepository {
    suspend fun save(shop: Shop): Shop

    suspend fun findById(id: String): Shop?

    suspend fun findByUsername(username: String): Shop?

    suspend fun findByEmail(email: String): Shop?

    suspend fun findByTaxCode(taxCode: String): Shop?

    suspend fun findByShopName(shopName: String): Shop?

    suspend fun existsByUsername(username: String): Boolean

    suspend fun existsByEmail(email: String): Boolean

    suspend fun existsByTaxCode(taxCode: String): Boolean

    suspend fun existsByShopName(shopName: String): Boolean

    suspend fun delete(id: String)

    suspend fun findAll(): List<Shop>

    suspend fun findByBusinessType(businessType: String): List<Shop>
}
