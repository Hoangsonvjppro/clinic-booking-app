# Stage 1: Build
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy parent POM first (required for multi-module project)
COPY pom.xml ../pom.xml

# Copy service POM and sources
COPY payment-service/pom.xml .
COPY payment-service/src ./src

# Build the service
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar

# Environment vars defaults
ENV MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
ENV MOMO_QUERY=https://test-payment.momo.vn/v2/gateway/api/query

EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
