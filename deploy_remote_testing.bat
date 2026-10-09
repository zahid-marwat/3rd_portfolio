@echo off
title Zahid Marwat Portfolio - Remote Testing
cls
echo ========================================================
echo   Zahid Marwat - Senior AI & Computer Vision Engineer
echo   Production Build - Remote Testing
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
)

echo.
echo Building the production website...
call npm.cmd run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Production build failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Starting the production server on port 5173...
start "Portfolio Remote Testing Server" cmd /k "cd /d ""C:\Users\z-pc\Downloads\New folder (2)\copypasted repo with my info\portfolio-website"" && npx --yes serve -s dist -l 5173"

timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo   Creating a temporary public testing URL...
echo   Share the trycloudflare.com URL shown below.
echo   Keep this window open during testing.
echo ========================================================
echo.

call npx --yes cloudflared tunnel --url http://localhost:5173

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Cloudflare tunnel failed.
    echo The local server may still be available at http://localhost:5173
)

pause
