package kuwelym.shopee.domain.entities

import java.time.LocalDateTime

abstract class User(
    open val id: String? = null,
    open val username: String,
    open val password: String,
    open val email: String,
    open val phoneNumber: String? = null,
    open val createdAt: LocalDateTime = LocalDateTime.now(),
    open val updatedAt: LocalDateTime = LocalDateTime.now(),
    open val isActive: Boolean = true,
) {
    fun isValidEmail(): Boolean = email.contains("@") && email.contains(".")

    fun isValidUsername(): Boolean = username.isNotBlank() && username.length >= 3

    fun isValidPassword(): Boolean = password.length >= 6
}
