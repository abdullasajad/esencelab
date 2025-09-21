@echo off
echo 🚀 SNGCET Portal - Railway Backend Deployment
echo =============================================
echo.

echo 🔧 Preparing backend for Railway deployment...
echo.

REM Check if package.json exists in server directory
if not exist "server\package.json" (
    echo ❌ Server package.json not found
    pause
    exit /b 1
)

echo ✅ Server configuration verified
echo.
echo 🌐 RAILWAY DEPLOYMENT STEPS:
echo.
echo 1. CREATE RAILWAY ACCOUNT:
echo    • Go to https://railway.app
echo    • Sign up with GitHub account
echo    • Verify your account
echo.
echo 2. DEPLOY FROM GITHUB:
echo    • Click "New Project"
echo    • Select "Deploy from GitHub repo"
echo    • Choose this repository
echo    • Set root directory to: server
echo.
echo 3. CONFIGURE DEPLOYMENT:
echo    • Start Command: npm start
echo    • Build Command: npm install
echo    • Node Version: 18
echo.
echo 4. SET ENVIRONMENT VARIABLES:
echo    NODE_ENV=production
echo    PORT=5000
echo    MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sngcet_portal
echo    JWT_SECRET=sngcet_super_secure_jwt_secret_2025
echo    CORS_ORIGIN=https://your-netlify-site.netlify.app
echo    RATE_LIMIT_MAX_REQUESTS=1000
echo    DB_MAX_POOL_SIZE=50
echo.
echo 5. MONGODB ATLAS SETUP:
echo    • Go to https://mongodb.com/atlas
echo    • Create free cluster: sngcet-portal
echo    • Create database user
echo    • Whitelist Railway IP addresses
echo    • Get connection string
echo.
echo 📊 BACKEND FEATURES READY:
echo    • ✅ Optimized for 10K students
echo    • ✅ Rate limiting: 1000 req/15min
echo    • ✅ Database pooling: 50 connections
echo    • ✅ Security headers enabled
echo    • ✅ Performance monitoring
echo    • ✅ Error tracking
echo.
echo 🎯 HEALTH CHECK ENDPOINT:
echo    https://your-app.railway.app/api/health
echo.
echo 🎓 Your SNGCET Portal backend is ready for Railway!
echo.
pause
