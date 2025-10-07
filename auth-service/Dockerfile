# =====================
# Stage 1: Build
# =====================
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Use mvn from PATH in the maven image
RUN mvn -q -DskipTests clean package spring-boot:repackage

# =====================
# Stage 2: Run
# =====================
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/auth-service-*.jar app.jar
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 8081
ENV JAVA_OPTS=""
ENTRYPOINT ["./start.sh"]
