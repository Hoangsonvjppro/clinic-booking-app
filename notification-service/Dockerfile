# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy parent POM first
COPY ../pom.xml /workspace/parent-pom.xml

# Copy module POM and source
COPY pom.xml .
COPY src ./src

# Build with parent POM reference
RUN mvn -DskipTests package

# Stage 2: Run
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/*.jar ./app.jar
ENTRYPOINT ["java","-jar","./app.jar"]