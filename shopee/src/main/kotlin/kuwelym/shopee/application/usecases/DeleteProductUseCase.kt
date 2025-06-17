package kuwelym.shopee.application.usecases

interface DeleteProductUseCase {
    suspend fun execute(id: String): Result<String>
}
