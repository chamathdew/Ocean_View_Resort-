Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting Ocean View Resort Application" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

Write-Host "Starting Backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; `$host.ui.RawUI.WindowTitle = 'Ocean View Resort Backend'; .\mvnw.cmd spring-boot:run"

Write-Host "Starting Frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; `$host.ui.RawUI.WindowTitle = 'Ocean View Resort Frontend'; npm run dev"

Write-Host ""
Write-Host "Both servers are starting in separate terminal windows." -ForegroundColor Green
Write-Host "- Backend will be available at http://localhost:8080"
Write-Host "- Frontend will be available at http://localhost:5173"
Write-Host ""
