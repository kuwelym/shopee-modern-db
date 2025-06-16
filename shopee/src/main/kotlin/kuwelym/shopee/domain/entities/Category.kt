package kuwelym.shopee.domain.entities

import java.time.LocalDateTime

data class Category(
    val id: String? = null,
    val name: String,
    val description: String? = null,
    val parentId: String? = null,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    val isActive: Boolean = true,
) {
    fun isRootCategory(): Boolean = parentId == null

    fun hasParent(): Boolean = parentId != null

    fun isValidName(): Boolean = name.isNotBlank()

    fun updateName(newName: String): Category {
        require(newName.isNotBlank()) { "Category name cannot be blank" }
        return this.copy(name = newName, updatedAt = LocalDateTime.now())
    }

    fun deactivate(): Category = this.copy(isActive = false, updatedAt = LocalDateTime.now())

    fun activate(): Category = this.copy(isActive = true, updatedAt = LocalDateTime.now())
}
