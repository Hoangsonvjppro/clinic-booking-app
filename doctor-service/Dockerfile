# Stage 1: Build
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy parent POM first (required for multi-module project)
COPY pom.xml ../pom.xml

# Copy service POM and sources
COPY doctor-service/pom.xml .
COPY doctor-service/src ./src

# Build the service
RUN mvn -B clean package -DskipTests spring-boot:repackage

# Stage 2: Runtime
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
