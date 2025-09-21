@echo off
echo 🚀 SNGCET Portal - Production Deployment Script
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)
cd ..

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)

REM Build production client
echo 🏗️  Building production client...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build client
    pause
    exit /b 1
)
cd ..

REM Copy production environment files
echo ⚙️  Setting up production environment...
if exist server\env.production (
    copy server\env.production server\.env
    echo ✅ Server environment configured
) else (
    echo ⚠️  server\env.production not found - using default settings
)

if exist client\env.production (
    copy client\env.production client\.env
    echo ✅ Client environment configured
) else (
    echo ⚠️  client\env.production not found - using default settings
)

REM Test server startup
echo 🧪 Testing server startup...
cd server
timeout /t 2 /nobreak >nul
node index.js --test 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Server test failed - check configuration
) else (
    echo ✅ Server configuration valid
)
cd ..

echo.
echo 🎉 Production build completed successfully!
echo.
echo 📋 Next Steps:
echo    1. Deploy client/build to your CDN/hosting service
echo    2. Deploy server to your production server
echo    3. Update environment variables with production values
echo    4. Configure MongoDB Atlas for production
echo    5. Set up monitoring and logging
echo.
echo 🌐 Deployment Options:
echo    • Frontend: Netlify, Vercel, AWS S3 + CloudFront
echo    • Backend: Railway, Heroku, AWS EC2, DigitalOcean
echo    • Database: MongoDB Atlas (recommended for 10K students)
echo.
echo 📊 Performance Notes:
echo    • Configured for 10K concurrent students
echo    • Rate limiting: 1000 requests per 15 minutes
echo    • Database pool: 50 connections max
echo    • File upload limit: 10MB
echo.
pause
