@echo off
echo Starte Venv und Server

REM Wechsel zum gewünschten Verzeichnis
cd /d C:\Users\samso\Desktop\Projekte\Silvan\silvan\server
echo Verzeichnis gewechselt: %cd%

REM Virtuelle Umgebung aktivieren
call .\venv\Scripts\activate.bat
# call .\venv\Scripts\activate.bat

echo Virtuelle Umgebung aktiviert
python server.py

