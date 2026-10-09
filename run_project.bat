@echo off
title Zahid Marwat Portfolio - Project Launcher
cls
echo ========================================================
echo   Zahid Marwat - Senior AI & Computer Vision Engineer
echo   Portfolio Development Server
echo ========================================================
echo.

cd /d "C:\Users\z-pc\Downloads\New folder (2)\copypasted repo with my info\portfolio-website"

if not exist "node_modules" (
    echo Installing dependencies...
    call npm.cmd install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Dependency installation failed.
        pause
        exit /b %ERRORLEVEL%
    )
) else (
    echo Dependencies verified.
)

echo.
echo Starting the portfolio at http://localhost:5173
echo.

call npm.cmd run dev -- --open
pause
