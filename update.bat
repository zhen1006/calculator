@echo off
echo Building project...
npm run build

echo Adding changes to git...
git add docs

echo Committing...
git commit -m "build: update site"

echo Pushing to GitHub...
git push origin main

echo Done! Your site will be updated soon.
pause
