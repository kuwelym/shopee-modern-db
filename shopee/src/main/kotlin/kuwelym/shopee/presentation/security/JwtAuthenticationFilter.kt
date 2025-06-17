package kuwelym.shopee.presentation.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import kuwelym.shopee.domain.services.TokenService
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val tokenService: TokenService,
    private val userDetailsService: UserDetailsService,
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val authHeader = request.getHeader("Authorization")

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        try {
            val token = authHeader.substring(7)
            if (tokenService.validateToken(token)) {
                val username = tokenService.extractUsername(token)

                if (username != null && SecurityContextHolder.getContext().authentication == null) {
                    try {
                        // Load user details using UserDetailsService
                        val userDetails = userDetailsService.loadUserByUsername(username)

                        val authentication =
                            UsernamePasswordAuthenticationToken(
                                userDetails,
                                null, // Store the token as credentials
                                userDetails.authorities,
                            )

                        authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
                        SecurityContextHolder.getContext().authentication = authentication
                    } catch (e: Exception) {
                        logger.error("Failed to load user details for username: $username", e)
                    }
                } else {
                    println("JwtAuthenticationFilter: Username is null or authentication already exists")
                }
            } else {
                println("JwtAuthenticationFilter: Token validation failed")
            }
        } catch (e: Exception) {
            // Log error but don't fail the filter chain
            println("JwtAuthenticationFilter: Exception during authentication: ${e.message}")
            logger.error("JWT Authentication failed", e)
        }

        filterChain.doFilter(request, response)
    }
}
