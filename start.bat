@echo off
cd snake-game
echo Starting server in a new window...
start "Next.js Server" cmd /k "npm run start"

timeout /t 5 /nobreak >nul

echo Opening browser to localhost:3000...
start http://localhost:3000

exit
