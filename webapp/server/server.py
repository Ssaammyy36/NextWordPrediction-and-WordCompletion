from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

import torch.nn.functional as F
import re
import os

# Starte Webserver
app = Flask(__name__)
CORS(app)  # Aktiviere CORS für alle Routen

MODEL_DIR = "./models/german-gpt2"

def load_model_and_tokenizer(model_dir, model_name="dbmdz/german-gpt2"):
    """
    Lädt das Modell und den Tokenizer aus dem lokalen Verzeichnis oder lädt es aus Hugging Face herunter.

    Args:
        model_dir (str): Das Verzeichnis, in dem das Modell und der Tokenizer lokal gespeichert sind.
        model_name (str): Der Name des Modells aus dem Hugging Face Hub.

    Returns:
        tuple: Ein Tuple bestehend aus Tokenizer und Modell.
    """
    try:
        # Lokales Laden versuchen
        print(f"Versuche, Modell aus {model_dir} zu laden...")
        tokenizer = AutoTokenizer.from_pretrained(model_dir)
        model = AutoModelForCausalLM.from_pretrained(model_dir)
        print("Modell erfolgreich lokal geladen.")

    except Exception as local_error:
        print(f"Fehler beim lokalen Laden: {local_error}")

        # Herunterladen aus Hugging Face
        try:
            print(f"Starte Download von {model_name}...")
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForCausalLM.from_pretrained(model_name)

            # Speichern des Modells und Tokenizers
            os.makedirs(model_dir, exist_ok=True)
            tokenizer.save_pretrained(model_dir)
            model.save_pretrained(model_dir)
            print(f"Modell erfolgreich heruntergeladen und gespeichert in {model_dir}.")
        except Exception as download_error:
            print(f"Fehler beim Herunterladen: {download_error}")
            raise RuntimeError("Weder lokales Laden noch Download des Modells war erfolgreich.") from download_error

    return tokenizer, model

# Initialisierung von Tokenizer und Modell
toker, model = load_model_and_tokenizer(MODEL_DIR)

def remove_special_characters(word):
    return re.sub(r"[^A-Za-z0-9ÄÖÜäöüß]", "", word)  # Erlaubt nur Buchstaben (inkl. Umlaute) und Zahlen

def get_top_predictions(input, model, tokenizer, top_k=100):
    """
    Generiert die Top-k wahrscheinlichsten Vorhersagen für das nächste Wort.

    Args:
        input (str): Der Eingabetext, für den Vorhersagen generiert werden sollen.
        model (transformers.PreTrainedModel): Das vortrainierte Sprachmodell.
        tokenizer (transformers.PreTrainedTokenizer): Der Tokenizer für das Sprachmodell.
        top_k (int, optional): Die Anzahl der wahrscheinlichsten Vorhersagen.

    Returns:
        list: Eine Liste der Top-k vorhergesagten Wörter und deren Wahrscheinlichkeiten.
    """
    # Tokenisiere den Text
    inputs = tokenizer(input, return_tensors="pt")

    # Vorhersage für das nächste Token
    print("Startet Vorhersage...")
    with torch.no_grad():
        logits = model(**inputs).logits[:, -1, :]

    # Softmax anwenden, um die Logits in Wahrscheinlichkeiten umzuwandeln
    probs = F.softmax(logits, dim=-1)

    # Top-k wahrscheinlichste Wörter auswählen
    top_k_probs = torch.topk(probs, top_k)
    top_k_ids = top_k_probs.indices[0].tolist()
    top_k_values = top_k_probs.values[0].tolist()  # Wahrscheinlichkeiten direkt als Float

    # Top-k Wörter dekodieren und Sonderzeichen entfernen
    top_k_words = [remove_special_characters(tokenizer.decode(pred_id).strip()) for pred_id in top_k_ids]

    # Filtere leere Wörter aus
    top_k_words = [word for word in top_k_words if word]

    # Wenn keine Wörter übrig sind, gebe eine leere Liste zurück
    if not top_k_words:
        return []

    # Kombiniere Wörter mit ihren Wahrscheinlichkeiten
    predictions_with_probs = [{"word": word, "probability": prob} for word, prob in zip(top_k_words, top_k_values)]

    # Sortiere nach Wahrscheinlichkeit in absteigender Reihenfolge
    sorted_predictions = sorted(predictions_with_probs, key=lambda x: x["probability"], reverse=True)

    print(f"Vorhersage (sortiert): {sorted_predictions}")
    return sorted_predictions

# Server Test Seite 
@app.route("/checkStatus")
def home():
    return "Online"

# Vorhersage
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Hole Daten aus der Anfrage
        data = request.get_json()
        user_input = data.get("inputText", "")  # Standardmäßig ein leerer String, falls nicht vorhanden
        print(f"Empfangene Daten: {user_input}")

        # Text vorbereiten
        user_input = user_input.lower()
        user_input = user_input.rstrip()

        # Generiere Vorhersagen
        sorted_predictions = get_top_predictions(user_input, model, toker, top_k=200)

        # Rückgabe der Vorhersagen
        return jsonify({
            "input": user_input,
            "predictions": sorted_predictions
        })

    except Exception as e:
        print(f"Fehler: {e}")
        return jsonify({"error": "Fehler bei der Verarbeitung der Anfrage"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

"""
    with app.test_client() as client:
        # Testinput erstellen
        test_input = {"inputText": "Hallo, wie geht es"}
        
        # POST-Anfrage an den /predict Endpunkt
        response = client.post("/predict", json=test_input)
        
        # Antwort verarbeiten
        if response.status_code == 200:
            print("Vorhersage erfolgreich!")
            print("Antwort:", response.get_json())  # Ausgabe des JSON-Inhalts
        else:
            print("Fehler beim Anfragen:", response.status_code)
            print("Antwort:", response.data.decode("utf-8"))"""