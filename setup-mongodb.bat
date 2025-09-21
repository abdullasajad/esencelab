@echo off
echo Setting up MongoDB for Esencelab SNGCET Portal...
echo.

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo MongoDB is not installed or not in PATH.
    echo Please install MongoDB Community Server from:
    echo https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b 1
)

REM Create data directory
if not exist "C:\data\db" (
    echo Creating MongoDB data directory...
    mkdir "C:\data\db"
)

REM Start MongoDB service
echo Starting MongoDB service...
net start MongoDB 2>nul
if %errorlevel% neq 0 (
    echo MongoDB service not found. Starting manually...
    start "MongoDB" mongod --dbpath "C:\data\db"
    timeout /t 5 /nobreak >nul
)

echo.
echo MongoDB setup complete!
echo You can now run: npm run dev
echo.
pause
