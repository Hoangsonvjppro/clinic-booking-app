# ===== build stage =====
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
# copy parent pom để maven có thể resolve
COPY pom.xml ./pom.xml
# copy module pom + source
COPY appointment-service/pom.xml ./appointment-service/pom.xml
COPY appointment-service/src ./appointment-service/src
# build jar (đảm bảo resources được đóng gói)
WORKDIR /workspace/appointment-service
RUN mvn -DskipTests package

# ===== run stage =====
FROM eclipse-temurin:21-jre
WORKDIR /app
# copy jar đã build sang runtime, đặt tên cố định app.jar
COPY --from=build /workspace/appointment-service/target/*.jar /app/app.jar
# JAVA_TOOL_OPTIONS sẽ được JVM đọc tự động, không cần shell
ENV JAVA_TOOL_OPTIONS=""
ENTRYPOINT ["java","-jar","/app/app.jar"]
