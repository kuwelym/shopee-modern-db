package kuwelym.shopee.controller

import kuwelym.shopee.model.UserDTO
import kuwelym.shopee.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
class AuthController(private val authService: AuthService) {
    @PostMapping("/register")
    fun register(@RequestBody userDTO: UserDTO): ResponseEntity<Any> = authService.register(userDTO)

    @PostMapping("/login")
    fun login(@RequestBody userDTO: UserDTO): ResponseEntity<Any> = authService.login(userDTO)

    @PostMapping("/logout")
    fun logout(@RequestHeader("Authorization") token: String): ResponseEntity<Any> = authService.logout(token)
}
