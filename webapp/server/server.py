from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

import torch.nn.functional as F
import re
import os

import json

MODEL_DIR = "./models/german-gpt2"
MODEL_NAME= "dbmdz/german-gpt2"
STARTING_WORDS_URL = "top100_starting_words.json"

# --- Helper Functions ---

def load_model_and_tokenizer(model_dir, model_name="dbmdz/german-gpt2"):
    """
    Loads the model and tokenizer.
    It first tries to load them from a local directory. If that fails,
    it downloads them from the Hugging Face Hub and saves them locally for future use.

    Args:
        model_dir (str): The local directory for the model.
        model_name (str): The model name on the Hugging Face Hub.

    Returns:
        tuple: A tuple containing the loaded tokenizer and model.
    """
    try:
        # Attempt to load from the local directory first to save time and bandwidth.
        print(f"Attempting to load model from {model_dir}...")
        tokenizer = AutoTokenizer.from_pretrained(model_dir)
        model = AutoModelForCausalLM.from_pretrained(model_dir)
        print("Model loaded successfully from local directory.")
    except Exception as local_error:
        print(f"Failed to load locally: {local_error}")
        # If loading locally fails, download from Hugging Face.
        try:
            print(f"Downloading model '{model_name}' from Hugging Face Hub...")
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForCausalLM.from_pretrained(model_name)

            # Save the downloaded model and tokenizer to the specified directory
            # for faster loading next time.
            os.makedirs(model_dir, exist_ok=True)
            tokenizer.save_pretrained(model_dir)
            model.save_pretrained(model_dir)
            print(f"Model downloaded and saved to {model_dir}.")
        except Exception as download_error:
            print(f"Fatal: Failed to download model: {download_error}")
            # If both local loading and downloading fail, the server can't start.
            raise RuntimeError("Model could not be loaded locally or downloaded.") from download_error

    return tokenizer, model

def remove_special_characters(word):
    """Removes special characters from a string, allowing only alphanumeric chars and German umlauts."""
    return re.sub(r"[^A-Za-z0-9ÄÖÜäöüß]", "", word)

def get_top_predictions(input_text, model, tokenizer, top_k=500):
    """
    Generates the top-k most likely next-word predictions for a given text.

    Args:
        input_text (str): The input text.
        model: The pre-trained language model.
        tokenizer: The tokenizer for the language model.
        top_k (int): The number of top predictions to return.

    Returns:
        list: A sorted list of prediction dictionaries, each with 'word' and 'probability'.
    """
    # 1. Tokenize the input text into a format the model understands.
    inputs = tokenizer(input_text, return_tensors="pt")

    # 2. Get model predictions (logits).
    print("Generating predictions...")
    with torch.no_grad():
        logits = model(**inputs).logits[:, -1, :]

    # 3. Convert logits to probabilities using softmax.
    probs = F.softmax(logits, dim=-1)

    # 4. Get the top 'k' predictions.
    top_k_probs = torch.topk(probs, top_k)
    top_k_ids = top_k_probs.indices[0].tolist()
    top_k_values = top_k_probs.values[0].tolist()

    # 5. Decode and clean up words.
    decoded_words = [tokenizer.decode(pred_id).strip() for pred_id in top_k_ids]
    cleaned_words = [remove_special_characters(word) for word in decoded_words]

    # 6. Combine words with probabilities and filter out empty strings and single-letter words.
    predictions_with_probs = [
        {"word": word, "probability": prob}
        for word, prob in zip(cleaned_words, top_k_values) if word and len(word) > 1
    ]

    # 7. Sort the final list.
    sorted_predictions = sorted(predictions_with_probs, key=lambda x: x["probability"], reverse=True)

    print(f"Top predictions generated for input: '{input_text}'")
    return sorted_predictions

# --- Application Factory ---

def create_app():
    """Creates and configures the Flask application."""
    app = Flask(__name__)
    CORS(app)

    print("--- Initializing Application: Loading Model ---")
    toker, model = load_model_and_tokenizer(MODEL_DIR, MODEL_NAME)
    print("--- Model Loaded: Defining Routes ---")

    # --- API Endpoints (defined inside the factory) ---
    @app.route("/checkStatus")
    def check_status():
        """A simple endpoint to check if the server is running."""
        return "Online"

    @app.route("/starting-words")
    def get_starting_words():
        """An endpoint to get a list of sentence starters."""
        try:
            with open("top100_starting_words.json", 'r', encoding='utf-8') as f:
                starters = json.load(f)
            return jsonify({"starters": starters})
        except Exception as e:
            print(f"Error loading starting words: {e}")
            return jsonify({"starters": []}), 500 # Return empty list and error code

    @app.route("/predict", methods=["POST"])
    def predict():
        """
        The main prediction endpoint.
        Receives text, generates predictions, and returns them as JSON.
        """
        try:
            data = request.get_json()
            user_input = data.get("inputText", "")
            print(f"Received for prediction: '{user_input}'")

            prepared_input = user_input.lower().rstrip()
            predictions = get_top_predictions(prepared_input, model, toker, top_k=200)

            return jsonify({
                "input": user_input,
                "predictions": predictions
            })
        except Exception as e:
            print(f"An error occurred during prediction: {e}")
            return jsonify({"error": "An error occurred on the server"}), 500

    print("--- Application Ready ---")
    return app

# --- Server Start ---

# Create the app instance using the factory.
app = create_app()

if __name__ == "__main__":
    # Starts the Flask development server.
    app.run(debug=True, host="0.0.0.0", port=5000)