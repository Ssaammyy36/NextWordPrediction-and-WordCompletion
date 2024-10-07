import React, { useState } from 'react';

import { pipeline, env } from '@xenova/transformers';

function TextInput({ inputText, setInputText }) {

    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false); 

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === ' ') { 
            console.log("Spacekey detected")
            predictNextWord(); // Word-Prediction-Funktion aufrufen
        }
    };

    async function predictNextWord() {
        setLoading(true); 
        try {
            console.log("Test 1");
            const model = await pipeline('fill-mask', 'bert-base-uncased');
            const maskedSentence = `${inputText} [MASK]`;
  
            const results = await model(maskedSentence);
  
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
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Input some text ..."
                value={inputText} // Verknüpft den State mit dem Input-Feld
                onChange={handleInputChange} // Aktualisiert den State bei Änderungen
                onKeyDown={handleKeyDown} // Event für Tastenanschläge
            />
        </div>
    );
}

export default TextInput;
