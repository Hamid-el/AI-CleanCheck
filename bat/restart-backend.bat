@echo off
echo Stopping any existing backend processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting backend with observation detection...
cd "%~dp0backend"
start "AI CleanCheck Backend" cmd /k npm start

echo Backend restarted successfully!
echo Check the new window for backend logs.
pause
