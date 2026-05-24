@echo off
REM Start backend with in-memory H2 (no MySQL required for local dev)
where java >nul 2>&1
if errorlevel 1 (
  echo Java 17+ is required. Install JDK from https://adoptium.net/ and try again.
  exit /b 1
)

if exist mvnw.cmd (
  call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
) else (
  mvn spring-boot:run -Dspring-boot.run.profiles=dev
)
