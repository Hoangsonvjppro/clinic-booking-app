# ===== build stage =====
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
# copy đúng cấu trúc maven
COPY pom.xml .
COPY src ./src
# build jar (đảm bảo resources được đóng gói)
RUN mvn -DskipTests package

# ===== run stage =====
FROM eclipse-temurin:21-jre
WORKDIR /app
# copy jar đã build sang runtime, đặt tên cố định app.jar
COPY --from=build /workspace/target/*.jar /app/app.jar
# JAVA_TOOL_OPTIONS sẽ được JVM đọc tự động, không cần shell
ENV JAVA_TOOL_OPTIONS=""
ENTRYPOINT ["java","-jar","/app/app.jar"]
