import unittest
from server import app  # Importiere die Flask-App aus server.py


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



if __name__ == "__main__":
    unittest.main()
