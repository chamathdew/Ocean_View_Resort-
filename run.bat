@echo off
echo ===================================================
echo Starting Ocean View Resort Application
echo ===================================================

echo Starting Backend server...
start "Ocean View Resort - Backend" cmd /k "cd backend && title Ocean View Resort Backend && .\mvnw.cmd spring-boot:run"

echo Starting Frontend server...
start "Ocean View Resort - Frontend" cmd /k "cd frontend && title Ocean View Resort Frontend && npm run dev"

echo.
echo Both servers are starting in separate terminal windows.
echo - Backend will be available at http://localhost:8080
echo - Frontend will be available at http://localhost:5173
echo.
echo You can close this window.
pause
