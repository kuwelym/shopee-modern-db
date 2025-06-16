package kuwelym.shopee.domain.repositories

import kuwelym.shopee.domain.entities.Product

interface ProductRepository {
    suspend fun save(product: Product): Product

    suspend fun findById(id: String): Product?

    suspend fun findByShopId(shopId: String): List<Product>

    suspend fun findByCategoryId(categoryId: String): List<Product>

    suspend fun findByName(name: String): List<Product>

    suspend fun findAll(): List<Product>

    suspend fun findActiveProducts(): List<Product>

    suspend fun findInStockProducts(): List<Product>

    suspend fun delete(id: String)

    suspend fun searchByNameContaining(query: String): List<Product>
}
