package kuwelym.shopee.service

import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import java.util.concurrent.TimeUnit

@Service
class TokenBlacklistService(private val redisTemplate: RedisTemplate<String, String>) {
    private val BLACKLIST_PREFIX = "blacklist:"
    private val TOKEN_EXPIRATION = 10L // 10 hours

    fun blacklistToken(token: String) {
        val key = BLACKLIST_PREFIX + token
        redisTemplate.opsForValue().set(key, "blacklisted", TOKEN_EXPIRATION, TimeUnit.HOURS)
    }

    fun isTokenBlacklisted(token: String): Boolean {
        val key = BLACKLIST_PREFIX + token
        return redisTemplate.hasKey(key)
    }
} 
