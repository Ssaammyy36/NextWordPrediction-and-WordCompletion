import { useState } from 'react';

function InputArea() {
  const [inputText, setInputText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false); // Zustand für Ladeanzeige

  // Funktion zur Vorhersage des nächsten Wortes
  async function predictNextWord() {
    setLoading(true); // Ladeanzeige aktivieren
    try {
      // Lade das Standard-BERT-Modell
      const model = await pipeline('fill-mask', 'bert'); // Standard BERT Modell

      // Erstelle einen Satz mit einem Platzhalter für das nächste Wort
      const maskedSentence = `${inputText} [MASK]`;

      // Führe die Vorhersage durch
      const results = await model(maskedSentence);

      // Setze die Vorhersagen in den Zustand
      const newPredictions = results.slice(0, 10).map((result) => ({
        token_str: result.token_str,
        score: result.score,
      }));

      setPredictions(newPredictions);
    } catch (error) {
      console.error("Fehler bei der Vorhersage:", error);
    } finally {
      setLoading(false); // Ladeanzeige deaktivieren
    }
  }

  return (
    <>
      <div className="p-10">
        <h1>Input Text</h1>
        <div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Input some text ..."
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              onChange={(e) => setInputText(e.target.value)} // Update inputText
            />
          </div>

          <div className="d-flex flex-wrap gap-3">
            <button type="button" className="btn btn-outline-danger">
              <i className="bi bi-x-circle"></i> Delete Letter 
            </button>
            <button type="button" className="btn btn-outline-warning">
              <i className="bi bi-trash"></i> Delete Word
            </button>
            <button type="button" className="btn btn-outline-success" onClick={predictNextWord} disabled={loading}>
              <i className="bi bi-arrow-right-circle"></i> {loading ? 'Loading...' : 'Next Word'}
            </button>
          </div>
        </div>

        {/* Anzeige der Vorhersagen */}
        {predictions.length > 0 && (
          <div className="mt-3">
            <h2>Vorhersagen für das nächste Wort:</h2>
            <ul className="list-group">
              {predictions.map((prediction, index) => (
                <li key={index} className="list-group-item">
                  {prediction.token_str}: {prediction.score.toFixed(4)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div> 
    </>
  );
}

export default InputArea;
