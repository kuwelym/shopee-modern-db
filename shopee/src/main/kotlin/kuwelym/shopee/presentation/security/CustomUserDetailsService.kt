package kuwelym.shopee.presentation.security

import kotlinx.coroutines.runBlocking
import kuwelym.shopee.domain.repositories.BuyerRepository
import kuwelym.shopee.domain.repositories.ShopRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val shopRepository: ShopRepository,
    private val buyerRepository: BuyerRepository,
) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails {
        return runBlocking {
            // Try to find as Shop first
            val shop = shopRepository.findByUsername(username)
            if (shop != null) {
                return@runBlocking CustomUserDetails(shop, "SHOP")
            }

            // Try to find as Buyer
            val buyer = buyerRepository.findByUsername(username)
            if (buyer != null) {
                return@runBlocking CustomUserDetails(buyer, "BUYER")
            }

            throw UsernameNotFoundException("User not found with username: $username")
        }
    }
}
