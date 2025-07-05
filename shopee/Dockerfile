# Multi-stage build for better caching and smaller final image
FROM eclipse-temurin:17-jdk-alpine AS build

# Set working directory
WORKDIR /workspace/app

# Copy gradle files first for better caching
COPY gradle gradle
COPY gradlew gradlew.bat ./
COPY build.gradle.kts settings.gradle.kts ./

# Download dependencies (this layer will be cached unless gradle files change)
RUN ./gradlew dependencies --no-daemon

# Copy source code
COPY src src

# Build the application (this layer will be cached unless source code changes)
RUN ./gradlew bootJar --no-daemon -x test

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Add labels for better image management
LABEL maintainer="shopee-app"
LABEL version="1.0"
LABEL description="Shopee application"

# Create app user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy the built JAR file from build stage
COPY --from=build /workspace/app/build/libs/*.jar app.jar

# Change ownership to app user
RUN chown -R appuser:appgroup /app

# Switch to app user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Run the application using the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
