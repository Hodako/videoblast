
@echo off
echo Installing npm dependencies...
call npm install

echo.
echo Running database migrations...
call npx prisma migrate dev

echo.
echo Seeding the database...
call npx prisma db seed

echo.
echo Setup complete. You can now run the application using start.bat
pause
