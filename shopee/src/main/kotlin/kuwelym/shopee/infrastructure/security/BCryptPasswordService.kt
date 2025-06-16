package kuwelym.shopee.infrastructure.security

import kuwelym.shopee.domain.services.PasswordService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class BCryptPasswordService(
    private val passwordEncoder: PasswordEncoder,
) : PasswordService {
    override fun encode(rawPassword: String): String {
        return passwordEncoder.encode(rawPassword)
    }

    override fun matches(
        rawPassword: String,
        encodedPassword: String,
    ): Boolean {
        return passwordEncoder.matches(rawPassword, encodedPassword)
    }
}
