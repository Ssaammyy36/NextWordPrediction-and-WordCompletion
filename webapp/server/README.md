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

## Venv in Windows erstellen und Abhängigkeiten verwalten

Dieses Projekt verwendet `pip-tools` für ein sauberes und reproduzierbares Abhängigkeitsmanagement.

1.  **Umgebung erstellen:**
    `python -m venv .venv`

2.  **Umgebung aktivieren:**
    `.\.venv\Scripts\Activate`

3.  **Tools installieren und Abhängigkeiten synchronisieren:**
    - `pip install --upgrade pip`
    - `pip install pip-tools`
    - `pip-sync` (Dieser Befehl installiert alle Pakete aus der `requirements.txt`)

4.  **Umgebung beenden:**
    `deactivate`

### Workflow zur Verwaltung von Abhängigkeiten

Um Pakete hinzuzufügen oder zu ändern, befolge diesen Prozess:

1.  **Direkte Abhängigkeiten anpassen:**
    Öffne die Datei `requirements.in` und füge die gewünschten Pakete hinzu oder entferne sie (z.B. `flask` oder `pandas`).

2.  **`requirements.txt` neu erstellen:**
    Führe den folgenden Befehl aus. Er liest die `requirements.in` und erstellt eine neue `requirements.txt` mit allen transitiven Abhängigkeiten und fixierten Versionen.
    ```shell
    pip-compile requirements.in > requirements.txt
    ```

3.  **Virtuelle Umgebung synchronisieren:**
    Führe diesen Befehl aus, um die Pakete in deiner `.venv` an die neue `requirements.txt` anzupassen. Fehlende Pakete werden installiert, überflüssige entfernt.
    ```shell
    pip-sync
    ```