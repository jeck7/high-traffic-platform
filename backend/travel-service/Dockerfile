# Multi-stage build for Travel Service
FROM openjdk:17-slim

# Set working directory
WORKDIR /app

# Copy the built jar
COPY target/*.jar app.jar

# Performance optimizations
ENV JAVA_OPTS="-Xms512m -Xmx1g -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+UseStringDeduplication -XX:+UseCompressedOops -XX:+OptimizeStringConcat -XX:+UseCompressedClassPointers"

# Expose port
EXPOSE 8082

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8082/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 