@echo off
echo Testing MongoDB Connection for SNGCET Portal...
echo.

REM Check if MongoDB service is running
echo Checking MongoDB service status...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% equ 0 (
    echo ✅ MongoDB service is running
) else (
    echo ⚠️  MongoDB service not running. Starting it...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo ❌ Failed to start MongoDB service
        echo Please check if MongoDB is installed properly
        pause
        exit /b 1
    )
)

REM Test connection
echo.
echo Testing database connection...
mongo --eval "db.adminCommand('ismaster')" --quiet
if %errorlevel% equ 0 (
    echo ✅ MongoDB connection successful!
    echo.
    echo 🎓 SNGCET Portal is ready to launch!
    echo Run: npm run dev
) else (
    echo ❌ MongoDB connection failed
    echo Please ensure MongoDB is running on localhost:27017
)

echo.
pause
