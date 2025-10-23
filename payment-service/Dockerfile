FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml first and download dependencies (cached)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of your source code
COPY src ./src

# Package the Spring Boot app
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port
EXPOSE 8080

# Environment vars (example defaults)
ENV MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
ENV MOMO_QUERY=https://test-payment.momo.vn/v2/gateway/api/query

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
