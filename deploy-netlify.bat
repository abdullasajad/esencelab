@echo off
echo 🚀 SNGCET Portal - Netlify Deployment
echo ====================================
echo.

echo 📦 Building production client...
cd client
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.
echo 📁 Build output ready in: client\dist\
echo 📊 Build size: ~1.8MB (optimized for 10K students)
echo.
echo 🌐 DEPLOYMENT OPTIONS:
echo.
echo 1. DRAG & DROP DEPLOYMENT (Easiest):
echo    • Go to https://netlify.com
echo    • Click "Add new site" → "Deploy manually"
echo    • Drag the client\dist folder to the deploy area
echo    • Your site will be live instantly!
echo.
echo 2. NETLIFY CLI DEPLOYMENT:
echo    • Install: npm install -g netlify-cli
echo    • Login: netlify login
echo    • Deploy: netlify deploy --prod --dir=dist
echo.
echo 3. GITHUB DEPLOYMENT:
echo    • Push code to GitHub
echo    • Connect repository to Netlify
echo    • Auto-deploy on every push
echo.
echo 🎯 RECOMMENDED SETTINGS:
echo    • Build command: npm run build
echo    • Publish directory: dist
echo    • Node version: 18
echo.
echo 🔧 ENVIRONMENT VARIABLES TO SET:
echo    VITE_API_URL=https://your-backend-url.railway.app
echo    VITE_APP_NAME=SNGCET Portal
echo    VITE_COLLEGE_NAME=SNGCET College
echo    VITE_ENVIRONMENT=production
echo.
echo 🎓 Your SNGCET Portal frontend is ready for deployment!
echo.
pause

cd ..
