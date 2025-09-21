@echo off
title SNGCET Portal - Running

echo Starting MongoDB manually...
start "MongoDB" mongod --dbpath "C:\data\db"
timeout /t 5 /nobreak >nul
echo.
echo 🎓 Starting SNGCET Portal...
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
npm run dev
