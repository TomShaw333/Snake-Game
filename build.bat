@echo off
cd snake-game

if not exist node_modules (
  echo Installing dependencies...
  call npm install
)

echo Building project...
call npm run build

echo Starting server in a new window...
start "Next.js Server" cmd /k "npm run start"

timeout /t 5 /nobreak >nul

echo Opening browser to localhost:3000...
start http://localhost:3000

exit
