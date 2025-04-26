@echo off
echo Building project...
npm run build

echo Starting server...
start http://localhost:3000
npm run start
