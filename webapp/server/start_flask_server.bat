@echo off
echo Starte Venv und Server

REM Wechsel zum gewünschten Verzeichnis
cd /d C:\Users\samso\Documents\01 Privat\Projekte\smart_keyboard\umsetzung\webapp\server
echo Verzeichnis gewechselt: %cd%

REM Virtuelle Umgebung aktivieren
call ".\.venv\Scripts\activate.bat"

echo Server starten
python app\main.py

