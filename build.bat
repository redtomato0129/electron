@echo off
echo Installing dependencies...
call npm install

echo Building for Windows...
IF "%1"=="portable" (
    call npm run build:win-portable
) ELSE (
    call npm run build:win-installer
)

IF %ERRORLEVEL% NEQ 0 (
    echo Build failed with error %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

echo Build completed successfully! 