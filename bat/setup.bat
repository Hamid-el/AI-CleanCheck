@echo off
REM AI CleanCheck - Automated Setup Script for Windows

echo ========================================
echo AI CleanCheck - Automated Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Setup Backend
echo Setting up backend...
cd backend

if not exist package.json (
    echo [ERROR] Backend package.json not found!
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo ========================================
    echo IMPORTANT: Please edit backend\.env
    echo and add your OpenAI API key!
    echo ========================================
    echo.
)

cd ..

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Edit backend\.env and add your OpenAI API key
echo 2. Start the backend: cd backend ^&^& npm start
echo 3. Start the frontend: cd frontend ^&^& npx http-server -p 8080
echo 4. Open http://localhost:8080 in your browser
echo.
echo For detailed instructions, see QUICKSTART.md
echo.
pause
