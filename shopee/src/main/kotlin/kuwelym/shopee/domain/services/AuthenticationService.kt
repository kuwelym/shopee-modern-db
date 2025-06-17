package kuwelym.shopee.domain.services

import kuwelym.shopee.domain.entities.Buyer
import kuwelym.shopee.domain.entities.Shop
import kuwelym.shopee.domain.entities.User
import kuwelym.shopee.presentation.security.CustomUserDetails
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class AuthenticationService {
    /**
     * Gets the current authenticated user from the security context
     * @return The authenticated user (Shop or Buyer)
     * @throws BadCredentialsException if user is not authenticated or not found
     */
    fun getCurrentUser(): User {
        val authentication = getAuthentication()

        if (!authentication.isAuthenticated) {
            throw BadCredentialsException("User is not authenticated")
        }

        try {
            val userDetails =
                authentication.principal as? CustomUserDetails
                    ?: throw BadCredentialsException("Invalid authentication principal")

            return userDetails.getUser()
        } catch (e: ClassCastException) {
            throw BadCredentialsException("Invalid authentication principal")
        } catch (e: Exception) {
            throw BadCredentialsException("Authentication failed: ${e.message}")
        }
    }

    /**
     * Gets the current authenticated shop
     * @return The authenticated shop
     * @throws BadCredentialsException if user is not authenticated or not a shop
     */
    fun getCurrentShop(): Shop {
        val user = getCurrentUser()
        if (user is Shop) {
            return user
        }
        throw BadCredentialsException("Current user is not a shop")
    }

    /**
     * Gets the current authenticated buyer
     * @return The authenticated buyer
     * @throws BadCredentialsException if user is not authenticated or not a buyer
     */
    fun getCurrentBuyer(): Buyer {
        val user = getCurrentUser()
        if (user is Buyer) {
            return user
        }
        throw BadCredentialsException("Current user is not a buyer")
    }

    private fun getAuthentication(): Authentication {
        return SecurityContextHolder.getContext().authentication
            ?: throw BadCredentialsException("No authentication found in security context")
    }
}
