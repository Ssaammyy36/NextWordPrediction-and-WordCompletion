import unittest
import sys
import os

# Add the parent directory (server) to the Python path to allow for module imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app  # Import the Flask app from its new location


class FlaskTestCase(unittest.TestCase):
    def setUp(self):
        """
        Setze die Testumgebung für Flask ein.
        """
        self.app = app.test_client()  # Erstelle einen Test-Client
        self.app.testing = True       # Aktiviere den Testmodus (z. B. für Fehler-Handling)

    def test_check_status(self):
        """
        Teste den /checkStatus Endpunkt.
        """
        response = self.app.get("/checkStatus")

        self.assertEqual(response.status_code, 200)  # HTTP-Status prüfen
        self.assertEqual(response.data.decode("utf-8"), "Online")  # Antwortinhalt prüfen

    def test_predict(self):
        """
        Teste den /predict Endpunkt mit Beispiel-Input.
        """
        test_input = {"inputText": "Hallo, wie geht "}
        response = self.app.post(
            "/predict",
            json=test_input  # Sende JSON-Daten
        )

        self.assertEqual(response.status_code, 200)  # HTTP-Status prüfen

        # Parsiere die Antwort und prüfe den Inhalt
        json_data = response.get_json()
        self.assertIn("input", json_data)  # "input" sollte im JSON enthalten sein
        self.assertEqual(json_data["input"], test_input["inputText"])  # Eingabetext überprüfen
        self.assertIn("predictions", json_data)  # "predictions" sollte existieren
        self.assertIsInstance(json_data["predictions"], list)  # "predictions" sollte eine Liste sein
        print(f"Predictions for '{test_input["inputText"]}': {json_data["predictions"]}")

    def test_invalid_request(self):
        """
        Teste den /predict Endpunkt mit fehlendem Input.
        """
        response = self.app.post("/predict", json={})  # Leere JSON-Daten
        self.assertEqual(response.status_code, 500)  # Fehler erwarten
        json_data = response.get_json()
        self.assertIn("error", json_data)  # "error" sollte im JSON enthalten sein
    
    def test_unfinished_word(self):
        """
            Testet autocompletion bei unvollkommenem Wort
        """
        test_input = {"inputText": "Hallo, wie geht d"}
        response = self.app.post(
            "/predict",
            json=test_input  # Sende JSON-Daten
        )

        self.assertEqual(response.status_code, 200)  # HTTP-Status prüfen

        # Parsiere die Antwort und prüfe den Inhalt
        json_data = response.get_json()
        self.assertIn("input", json_data)  # "input" sollte im JSON enthalten sein
        self.assertIn("predictions", json_data)  # "predictions" sollte existieren
        self.assertIsInstance(json_data["predictions"], list)  # "predictions" sollte eine Liste sein



    def test_word_completion(self):
        """
        Tests the /test_completion endpoint for word completion.
        """
        # Request 
        response = self.app.get("/test_completion?text=Der+Ba")
        self.assertEqual(response.status_code, 200)
        
        # Check response
        json_data = response.get_json()
        self.assertIn("input", json_data)
        self.assertEqual(json_data["input"], "Der Ba")
        self.assertIn("completions", json_data)
        self.assertIsInstance(json_data["completions"], list)

        # Ausgabe anzeigen
        print(f"Completions for '{json_data['input']}': {json_data['completions']}")


if __name__ == "__main__":
    unittest.main()
