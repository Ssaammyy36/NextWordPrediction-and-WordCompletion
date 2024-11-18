from flask import Flask, jsonify
from flask_cors import CORS  # Importiere CORS

app = Flask(__name__)
CORS(app)  # Aktiviere CORS für alle Routen

@app.route("/")
def home():
    return "Moin das ist die Haputseite von Flask 😂"

@app.route("/test")
def greet():
    return jsonify({"message": "Hello das ist die Test Message von Flask!"})

if __name__ == "__main__":
    app.run(debug=True)
