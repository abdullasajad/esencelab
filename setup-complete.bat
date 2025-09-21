@echo off
title SNGCET Portal - Complete Setup
color 0A

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                   SNGCET PORTAL SETUP                        ║
echo  ║              Complete MongoDB + App Setup                    ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🎓 Setting up Esencelab for SNGCET Students...
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ This script requires Administrator privileges
    echo Right-click and select "Run as Administrator"
    pause
    exit /b 1
)

echo ✅ Running with Administrator privileges
echo.

REM Step 1: Create MongoDB data directory
echo 📁 Creating MongoDB data directory...
if not exist "C:\data\db" (
    mkdir "C:\data\db"
    echo ✅ Created C:\data\db
) else (
    echo ✅ Data directory already exists
)

REM Step 2: Try to start MongoDB service
echo 🔄 Starting MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB service started successfully
    set MONGO_RUNNING=1
) else (
    echo ⚠️  MongoDB service not available, will start manually
    set MONGO_RUNNING=0
)

REM Step 3: Test MongoDB connection
if %MONGO_RUNNING%==1 (
    echo 🔍 Testing MongoDB connection...
    mongo --eval "db.adminCommand('ismaster')" --quiet >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ MongoDB connection successful
    ) else (
        echo ⚠️  MongoDB connection test failed
        set MONGO_RUNNING=0
    )
)

REM Step 4: Setup environment
echo 📝 Setting up environment...
if not exist "server\.env" (
    copy server\env-local server\.env >nul
    echo ✅ Environment file created
) else (
    echo ✅ Environment file already exists
)

REM Step 5: Install dependencies if needed
echo 📦 Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    call npm install
    cd ..
)
if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    call npm install
    cd ..
)

echo ✅ Dependencies ready

REM Step 6: Create startup script
echo 🚀 Creating startup script...
(
echo @echo off
echo title SNGCET Portal - Running
echo.
if %MONGO_RUNNING%==0 (
    echo echo Starting MongoDB manually...
    echo start "MongoDB" mongod --dbpath "C:\data\db"
    echo timeout /t 5 /nobreak ^>nul
)
echo echo.
echo echo 🎓 Starting SNGCET Portal...
echo echo Frontend: http://localhost:3000
echo echo Backend:  http://localhost:5000
echo echo.
echo npm run dev
) > start-portal.bat

echo ✅ Startup script created: start-portal.bat

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    SETUP COMPLETE!                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🎯 SNGCET Portal is ready!
echo.
echo Next steps:
if %MONGO_RUNNING%==0 (
    echo 1. MongoDB will start automatically when you run the portal
)
echo 2. Run: start-portal.bat
echo 3. Open: http://localhost:3000
echo 4. Test all SNGCET features
echo.
echo 📱 Features ready:
echo ├── SNGCET branding with "E" logo
echo ├── Department selection (CSE, ECE, MECH, EEE, CIVIL)
echo ├── Alumni network
echo ├── Career opportunities
echo ├── Mobile responsive design
echo └── No statistics (clean interface)
echo.
pause
