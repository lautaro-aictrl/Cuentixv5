@echo off
cd /d "%~dp0"
echo Generando instalador .exe de CUENTIX...
npm run dist
pause
