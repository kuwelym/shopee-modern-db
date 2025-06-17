package kuwelym.shopee.presentation.security

import kuwelym.shopee.domain.entities.User
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUserDetails(
    private val user: User,
    private val userType: String,
) : UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableListOf(SimpleGrantedAuthority("ROLE_${userType.uppercase()}"))
    }

    override fun getPassword(): String = user.password

    override fun getUsername(): String = user.username

    override fun isAccountNonExpired(): Boolean = true

    override fun isAccountNonLocked(): Boolean = true

    override fun isCredentialsNonExpired(): Boolean = true

    override fun isEnabled(): Boolean = user.isActive

    // Custom method to get the full user entity
    fun getUser(): User = user
}
