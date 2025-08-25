@echo off
echo ===============================
echo 🚀 開始更新 Calculator 專案
echo ===============================

:: Step 1: build
echo [1/3] 建置專案 (npm run build)...
npm run build
if %errorlevel% neq 0 (
    echo ❌ build 失敗，停止執行！
    pause
    exit /b %errorlevel%
)

:: Step 2: git commit
echo [2/3] 提交變更 (git commit)...
git add docs
git commit -m "build: auto update"

:: Step 3: git push (force)
echo [3/3] 推送到 GitHub (git push --force)...
git push origin main --force

echo ===============================
echo ✅ 更新完成，請稍候 GitHub Pages 部署
echo ===============================
pause
