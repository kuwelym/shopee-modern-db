package kuwelym.shopee.domain.entities

import java.time.LocalDateTime

data class Buyer(
    override val id: String? = null,
    override val username: String,
    override val password: String,
    override val email: String,
    override val phoneNumber: String? = null,
    override val createdAt: LocalDateTime = LocalDateTime.now(),
    override val updatedAt: LocalDateTime = LocalDateTime.now(),
    override val isActive: Boolean = true,
    val fullName: String? = null,
    val dateOfBirth: LocalDateTime? = null,
    val address: String? = null,
) : User(id, username, password, email, phoneNumber, createdAt, updatedAt, isActive)
