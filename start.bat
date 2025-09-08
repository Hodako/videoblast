@echo off
echo Starting backend and frontend servers in separate windows...

start "Backend" cmd /c "npm run dev:backend"
start "Frontend" cmd /c "npm run dev:frontend"

echo.
echo Your application servers have been started.
echo Frontend should be available at: http://localhost:9002
echo Backend should be running at:  http://localhost:3001
echo.
pause
