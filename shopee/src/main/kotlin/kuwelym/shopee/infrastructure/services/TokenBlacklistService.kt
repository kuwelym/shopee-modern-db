package kuwelym.shopee.infrastructure.services

import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit

@Service
class TokenBlacklistService(private val redisTemplate: RedisTemplate<String, String>) {
    private val blacklistPrefix = "blacklist:"
    private val tokenExpiration = 10L // 10 hours

    fun blacklistToken(token: String) {
        val key = blacklistPrefix + token
        redisTemplate.opsForValue().set(key, "blacklisted", tokenExpiration, TimeUnit.HOURS)
    }

    fun isTokenBlacklisted(token: String): Boolean {
        val key = blacklistPrefix + token
        return redisTemplate.hasKey(key)
    }
}
