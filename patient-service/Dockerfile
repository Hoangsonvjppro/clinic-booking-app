# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy parent POM first (required for multi-module project)
COPY pom.xml ../pom.xml

# Copy service POM and sources
COPY patient-service/pom.xml .
COPY patient-service/src ./src

# Build the service
RUN mvn -DskipTests package

# Stage 2: Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/*.jar /app/app.jar
ENV JAVA_TOOL_OPTIONS=""
ENTRYPOINT ["java","-jar","/app/app.jar"]
