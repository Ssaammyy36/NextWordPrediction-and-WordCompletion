# Venv 

## Pyhton version checken 

1. Python version überprüfen: `python --version`
2. Python 3.12 installieren: https://www.python.org/downloads/release/python-3120/

### Für aktuelles Shell Fenster Version festlegen 

3. Path anschauen: `$env:Path -split ";" | Where-Object { $_ -match "Python" }`
   - python 312 muss ganz vorne stehen 
4. Link oben hinzufügen: `$env:Path = "C:\Users\samso\AppData\Local\Programs\Python\Python312;C:\Users\samso\AppData\Local\Programs\Python\Python312\Scripts;" + $env:Path`

### Dauerhaft festlegen

3. Windows Suche → „Umgebungsvariablen“ → Umgebungsvariablen…
4. Unter Benutzervariablen → Path → Bearbeiten.
5. Stelle sicher, dass diese zwei Einträge ganz oben stehen:
   ```shell
   C:\Users\samso\AppData\Local\Programs\Python\Python312
   C:\Users\samso\AppData\Local\Programs\Python\Python312\Scripts
   ```

## Venv in Windows erstellen 

1. Umgebung erstellen: `python -m venv .venv`
2. Umgebung starten: `.\.venv\Scripts\Activate`
3. Pip aktualisieren:  `pip install --upgrade pip`
4. Requirements.txt installieren: `pip install -r requirements.txt`
5. Umgebung beenden: `deactivate`

### Arbeiten mit Venv

1. Umgebung erstellen: `python -m venv .venv`
2. Paketeversionen dokumentieren: `pip freeze > requirements.txt`
3. Umgebung beenden: `deactivate`