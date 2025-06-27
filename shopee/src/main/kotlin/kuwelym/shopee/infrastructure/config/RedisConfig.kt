package kuwelym.shopee.infrastructure.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer
import org.springframework.data.redis.serializer.StringRedisSerializer
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator // Thêm import này
import com.fasterxml.jackson.databind.ObjectMapper.DefaultTyping // Thêm import này
import com.fasterxml.jackson.annotation.JsonAutoDetect // Thêm import này
import com.fasterxml.jackson.annotation.PropertyAccessor // Thêm import này

@Configuration
class RedisConfig {
    @Bean
    fun redisTemplate(connectionFactory: RedisConnectionFactory): RedisTemplate<String, Any> {
        val template = RedisTemplate<String, Any>()
        template.connectionFactory = connectionFactory

        template.keySerializer = StringRedisSerializer()
        template.hashKeySerializer = StringRedisSerializer()

        val objectMapper = ObjectMapper().apply {
            registerModule(KotlinModule.Builder().build())

            // Bắt đầu các dòng quan trọng cần thêm vào hoặc đảm bảo đã có
            setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY) // Đảm bảo dòng này
            activateDefaultTyping( // Đảm bảo khối này
                BasicPolymorphicTypeValidator.builder()
                    .allowIfBaseType(Any::class.java)
                    .build(),
                DefaultTyping.EVERYTHING
            )
            // Kết thúc các dòng quan trọng
        }
        val jsonSerializer = Jackson2JsonRedisSerializer(objectMapper, Any::class.java)

        template.valueSerializer = jsonSerializer
        template.hashValueSerializer = jsonSerializer

        template.afterPropertiesSet()
        return template
    }
}