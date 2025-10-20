# ===== build stage =====
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy pom first to leverage Docker layer caching
COPY pom.xml .

# Copy sources and build (with robust network retry flags)
COPY src ./src
RUN mvn -DskipTests package

# ===== run stage =====
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/*.jar /app/app.jar
ENV JAVA_TOOL_OPTIONS=""
ENTRYPOINT ["java","-jar","/app/app.jar"]
