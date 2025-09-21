@echo off
title Esencelab - SNGCET Student Portal
color 0A
echo.
echo  ███████╗███████╗███████╗███╗   ██╗ ██████╗███████╗██╗      █████╗ ██████╗ 
echo  ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝██╔════╝██║     ██╔══██╗██╔══██╗
echo  █████╗  ███████╗█████╗  ██╔██╗ ██║██║     █████╗  ██║     ███████║██████╔╝
echo  ██╔══╝  ╚════██║██╔══╝  ██║╚██╗██║██║     ██╔══╝  ██║     ██╔══██║██╔══██╗
echo  ███████╗███████║███████╗██║ ╚████║╚██████╗███████╗███████╗██║  ██║██████╔╝
echo  ╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═════╝ 
echo.
echo                    🎓 SNGCET Student Career Portal 🎓
echo                   SNS College of Engineering and Technology
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm run install-all
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check MongoDB connection
echo 🔍 Checking MongoDB connection...
where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB not found. Starting with Docker fallback...
    where docker >nul 2>nul
    if %errorlevel% neq 0 (
        echo ❌ Neither MongoDB nor Docker found.
        echo Please install MongoDB or Docker, or run setup-mongodb.bat
        pause
        exit /b 1
    ) else (
        echo 🐳 Starting MongoDB with Docker...
        docker-compose up -d mongodb
        timeout /t 10 /nobreak >nul
    )
) else (
    echo ✅ MongoDB found. Starting service...
    net start MongoDB 2>nul
    if %errorlevel% neq 0 (
        start "MongoDB" mongod --dbpath "C:\data\db"
        timeout /t 5 /nobreak >nul
    )
)

REM Seed sample data if needed
if not exist "server\.env" (
    echo 📝 Creating environment file...
    copy server\env-local server\.env >nul
)

echo.
echo 🚀 Starting SNGCET Portal...
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo.
echo Press Ctrl+C to stop the servers
echo.

REM Start the application
call npm run dev

pause
