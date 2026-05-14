@echo off
echo ========================================
echo   AI Sprint Platform - Server Restart
echo ========================================
echo.

echo [1/3] Stopping existing server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Found server on PID: %%a
    taskkill /F /PID %%a 2>nul
    if errorlevel 1 (
        echo Warning: Could not stop PID %%a - may need admin rights
    ) else (
        echo Server stopped successfully
    )
)

echo.
echo [2/3] Waiting for port to be released...
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Starting server...
start "AI Sprint Platform Server" cmd /c "npm start"

echo.
echo ========================================
echo Server restart initiated!
echo Check the new terminal window for server status
echo Server will be available at: http://localhost:3000
echo ========================================
echo.
pause

@REM Made with Bob
