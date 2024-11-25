from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Aktiviere CORS für alle Routen

@app.route("/")
def home():
    return "Moin das ist die Hauptseite von Flask 😂"

@app.route("/input", methods=["POST"])
def handle_input():
    # Hole Daten aus der Anfrage
    data = request.get_json()
    user_input = data.get("inputText", "")  # Standardmäßig ein leerer String, falls nicht vorhanden
    print(f"Empfangene Daten: {user_input}")

    # Hier könntest du eine Vorhersage oder andere Verarbeitung vornehmen
    response_message = f"Empfangen und verarbeitet: {user_input}"
    
    return jsonify({"message": response_message})

if __name__ == "__main__":
    app.run(debug=True)
