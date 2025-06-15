package kuwelym.shopee.service

import kuwelym.shopee.model.User
import kuwelym.shopee.model.UserDTO
import kuwelym.shopee.repository.UserRepository
import kuwelym.shopee.security.JwtUtil
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtil: JwtUtil,
    private val tokenBlacklistService: TokenBlacklistService
) {
    fun register(userDTO: UserDTO): ResponseEntity<Any> {
        if (userRepository.findByUsername(userDTO.username) != null) {
            return ResponseEntity.badRequest().body("Username already exists")
        }
        val user = User(username = userDTO.username, password = passwordEncoder.encode(userDTO.password))
        userRepository.save(user)
        return ResponseEntity.ok("User registered successfully")
    }

    fun login(userDTO: UserDTO): ResponseEntity<Any> {
        val user = userRepository.findByUsername(userDTO.username)
            ?: return ResponseEntity.badRequest().body("Invalid credentials")
        if (!passwordEncoder.matches(userDTO.password, user.password)) {
            return ResponseEntity.badRequest().body("Invalid credentials")
        }
        val token = jwtUtil.generateToken(user.username)
        return ResponseEntity.ok(mapOf("token" to token))
    }

    fun logout(token: String): ResponseEntity<Any> {
        tokenBlacklistService.blacklistToken(token)
        return ResponseEntity.ok("Logged out successfully")
    }
}
