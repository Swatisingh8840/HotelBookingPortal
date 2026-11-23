@echo off
echo ========================================================
echo  Starting Thomas Cook Hotel Booking Backend (Spring Boot)
echo ========================================================
cd /d %~dp0backend
call C:\tools\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run
pause
