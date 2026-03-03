@echo off
echo Compiling and Running Ocean View Resorts Management GUI...
mvnw.cmd exec:java -Dexec.mainClass="com.example.demo.client.gui.ManagementSystemGUI"
pause
