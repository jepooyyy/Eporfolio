@echo off
cd /d "C:\Users\Harvey\Desktop\Eporfolio"
git init
git add .
git commit -m "Initial AviJep portfolio with AI person detection using YOLOv8 and Django backend"
git branch -M main
git remote add origin https://github.com/AviJep/E-Portfolio.git
git push -u origin main
echo.
echo Push complete! Visit https://github.com/AviJep/E-Portfolio
pause
