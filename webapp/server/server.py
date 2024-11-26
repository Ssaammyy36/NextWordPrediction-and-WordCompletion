from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

import torch.nn.functional as F

app = Flask(__name__)
CORS(app)  # Aktiviere CORS für alle Routen

MODEL_DIR = "./models/german-gpt2"

def load_model_and_tokenizer(model_dir, model_name="dbmdz/german-gpt2"):
    """
    Lädt das Modell und den Tokenizer aus dem lokalen Verzeichnis.
    Falls nicht vorhanden, wird das Modell heruntergeladen und gespeichert.

    Args:
        model_dir (str): Das Verzeichnis, in dem das Modell und der Tokenizer lokal gespeichert sind.
        model_name (str): Der Name des Modells, das aus dem Hugging Face Hub geladen werden soll (Standard: "dbmdz/german-gpt2").

    Returns:
        tuple: Ein Tupel bestehend aus dem Tokenizer und dem Modell.
    """
    try:
        # Versuche, den Tokenizer und das Modell aus dem lokalen Verzeichnis zu laden
        print("Lade Modell und Tokenizer...")

        tokenizer = AutoTokenizer.from_pretrained(model_dir)
        model = AutoModelForCausalLM.from_pretrained(model_dir)
        print("Modell und Tokenizer erfolgreich aus dem lokalen Verzeichnis geladen.")

    except Exception as e:
        # Wenn nicht lokal verfügbar, lade aus Hugging Face und speichere es
        print(f"Lokal nicht gefunden. Lade aus dem Hugging Face Hub: {e}")

        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(model_name)
        tokenizer.save_pretrained(model_dir)
        model.save_pretrained(model_dir)
        print(f"Modell und Tokenizer wurden heruntergeladen und unter {model_dir} gespeichert.")

    return tokenizer, model

# Initialisierung von Tokenizer und Modell
toker, model = load_model_and_tokenizer(MODEL_DIR)

def get_top_predictions(user_input, model, tokenizer, top_k=10):
    """
    Generiert die Top-k wahrscheinlichsten Vorhersagen für das nächste Wort.

    Args:
        user_input (str): Der Eingabetext, für den Vorhersagen generiert werden sollen.
        model (transformers.PreTrainedModel): Das vortrainierte Sprachmodell.
        tokenizer (transformers.PreTrainedTokenizer): Der Tokenizer für das Sprachmodell.
        top_k (int, optional): Die Anzahl der wahrscheinlichsten Vorhersagen. Standard: 10.

    Returns:
        list: Eine Liste der Top-k vorhergesagten Wörter und deren Wahrscheinlichkeiten.
    """
    # Tokenisiere den Text
    inputs = tokenizer(user_input, return_tensors="pt")

    # Vorhersage für das nächste Token
    with torch.no_grad():
        logits = model(**inputs).logits[:, -1, :]

    # Softmax anwenden, um die Logits in Wahrscheinlichkeiten umzuwandeln
    probs = F.softmax(logits, dim=-1)

    # Top-k wahrscheinlichste Wörter auswählen
    top_k_probs = torch.topk(probs, top_k)
    top_k_ids = top_k_probs.indices[0].tolist()
    top_k_values = top_k_probs.values[0].tolist()  # Wahrscheinlichkeiten direkt als Float

    # Top-k Wörter dekodieren
    top_k_words = [tokenizer.decode(pred_id).strip() for pred_id in top_k_ids]

    # Kombiniere Wörter mit ihren Wahrscheinlichkeiten
    predictions_with_probs = [{"word": word, "probability": prob} for word, prob in zip(top_k_words, top_k_values)]

    # Sortiere nach Wahrscheinlichkeit in absteigender Reihenfolge
    sorted_predictions = sorted(predictions_with_probs, key=lambda x: x["probability"], reverse=True)

    print(f"Vorhersage (sortiert): {sorted_predictions}")
    return sorted_predictions



# Server Test Seite 
@app.route("/")
def home():
    return "Hallo, das ist die Testseite des Flask Servers."

# Vorhersage
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Hole Daten aus der Anfrage
        data = request.get_json()
        user_input = data.get("inputText", "")  # Standardmäßig ein leerer String, falls nicht vorhanden
        print(f"Empfangene Daten: {user_input}")

        # Generiere Vorhersagen
        sorted_predictions = get_top_predictions(user_input, model, toker, top_k=100)

        # Rückgabe der Vorhersagen
        return jsonify({
            "input": user_input,
            "predictions": sorted_predictions
        })

    except Exception as e:
        print(f"Fehler: {e}")
        return jsonify({"error": "Fehler bei der Verarbeitung der Anfrage"}), 500

if __name__ == "__main__":
    app.run(debug=True)
