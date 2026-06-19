# ===================== Build stage =====================
# Build jar bằng Maven + JDK 17 (không phụ thuộc máy có cài Maven/JDK hay không)
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Tải dependency trước (tận dụng cache Docker layer)
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

# Build (bỏ test cho nhanh)
COPY src ./src
RUN mvn -B -q clean package -DskipTests

# ===================== Run stage =====================
# Ảnh chạy gọn nhẹ chỉ có JRE 17
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy jar đã build (Spring Boot tạo 1 file *.jar executable, file plain là *.jar.original nên không bị trùng)
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
