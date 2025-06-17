package kuwelym.shopee.presentation.controllers

import kuwelym.shopee.application.dto.CreateProductRequest
import kuwelym.shopee.application.dto.UpdateProductRequest
import kuwelym.shopee.application.usecases.CreateProductUseCase
import kuwelym.shopee.application.usecases.DeleteProductUseCase
import kuwelym.shopee.application.usecases.GetAllProductsUseCase
import kuwelym.shopee.application.usecases.GetProductByIdUseCase
import kuwelym.shopee.application.usecases.GetProductsByShopUseCase
import kuwelym.shopee.application.usecases.SearchProductsUseCase
import kuwelym.shopee.application.usecases.UpdateProductUseCase
import kuwelym.shopee.presentation.dto.ApiResponse
import kuwelym.shopee.presentation.dto.ProductResponse
import kuwelym.shopee.presentation.dto.toResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/products")
class ProductController(
    private val createProductUseCase: CreateProductUseCase,
    private val getProductByIdUseCase: GetProductByIdUseCase,
    private val getAllProductsUseCase: GetAllProductsUseCase,
    private val getProductsByShopUseCase: GetProductsByShopUseCase,
    private val updateProductUseCase: UpdateProductUseCase,
    private val deleteProductUseCase: DeleteProductUseCase,
    private val searchProductsUseCase: SearchProductsUseCase,
) {
    @PostMapping
    suspend fun createProduct(
        @RequestBody request: CreateProductRequest,
    ): ResponseEntity<ApiResponse<ProductResponse>> {
        return createProductUseCase.execute(request)
            .fold(
                onSuccess = { product ->
                    ResponseEntity.status(HttpStatus.CREATED).body(
                        ApiResponse(
                            success = true,
                            message = "Product created successfully",
                            data = product.toResponse(),
                        ),
                    )
                },
                onFailure = { error ->
                    ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        ApiResponse(
                            success = false,
                            message = error.message ?: "Failed to create product",
                        ),
                    )
                },
            )
    }

    @GetMapping("/{id}")
    suspend fun getProductById(
        @PathVariable id: String,
    ): ResponseEntity<ApiResponse<ProductResponse>> {
        return getProductByIdUseCase.execute(id)
            .fold(
                onSuccess = { product ->
                    ResponseEntity.ok(
                        ApiResponse(
                            success = true,
                            message = "Product retrieved successfully",
                            data = product.toResponse(),
                        ),
                    )
                },
                onFailure = { error ->
                    ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ApiResponse(
                            success = false,
                            message = error.message ?: "Product not found",
                        ),
                    )
                },
            )
    }

    @GetMapping
    suspend fun getAllProducts(): ResponseEntity<ApiResponse<List<ProductResponse>>> {
        return getAllProductsUseCase.execute()
            .fold(
                onSuccess = { products ->
                    ResponseEntity.ok(
                        ApiResponse(
                            success = true,
                            message = "Products retrieved successfully",
                            data = products.map { it.toResponse() },
                        ),
                    )
                },
                onFailure = { error ->
                    ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                        ApiResponse(
                            success = false,
                            message = error.message ?: "Failed to retrieve products",
                        ),
                    )
                },
            )
    }

    @GetMapping("/my-products")
    suspend fun getMyProducts(): ResponseEntity<ApiResponse<List<ProductResponse>>> {
        return getProductsByShopUseCase.execute()
            .fold(
                onSuccess = { products ->
                    ResponseEntity.ok(
                        ApiResponse(
                            success = true,
                            message = "Your products retrieved successfully",
                            data = products.map { it.toResponse() },
                        ),
                    )
                },
                onFailure = { error ->
                    ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                        ApiResponse(
                            success = false,
                            message = error.message ?: "Failed to retrieve your products",
                        ),
                    )
                },
            )
    }

    @GetMapping("/search")
    suspend fun searchProducts(
        @RequestParam query: String,
    ): ResponseEntity<ApiResponse<List<ProductResponse>>> {
        return searchProductsUseCase.execute(query)
            .fold(
                onSuccess = { products ->
                    ResponseEntity.ok(
                        ApiResponse(
                            success = true,
                            message = "Search results retrieved successfully",
                            data = products.map { it.toResponse() },
                        ),
                    )
                },
                onFailure = { error ->
                    ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                        ApiResponse(
                            success = false,
                            message = error.message ?: "Search failed",
                        ),
                    )
                },
            )
    }

    @PutMapping("/{id}")
    suspend fun updateProduct(
        @PathVariable id: String,
        @RequestBody updateRequest: UpdateProductRequest,
    ): ResponseEntity<ApiResponse<ProductResponse>> {
        return updateProductUseCase.execute(id, updateRequest)
            .fold(
                onSuccess = { product ->
                    ResponseEntity.ok(
                        ApiResponse(
                            success = true,
                            message = "Product updated successfully",
                            data = product.toResponse(),
                        ),
                    )
                },
                onFailure = { error ->
                    ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        ApiResponse(
                            success = false,
                            message = error.message ?: "Failed to update product",
                        ),
                    )
                },
            )
    }

    @DeleteMapping("/{id}")
    suspend fun deleteProduct(
        @PathVariable id: String,
    ): ResponseEntity<ApiResponse<String>> {
        return deleteProductUseCase.execute(id)
            .fold(
                onSuccess = { message ->
                    ResponseEntity.ok(
                        ApiResponse(
                            success = true,
                            message = message,
                        ),
                    )
                },
                onFailure = { error ->
                    ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ApiResponse(
                            success = false,
                            message = error.message ?: "Failed to delete product",
                        ),
                    )
                },
            )
    }
}
