import React, { useState } from 'react';

import * as tf from '@tensorflow/tfjs';
//import { pipeline, env } from '@xenova/transformers';

function TextInput({ inputText, setInputText }) {

    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false); 

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === ' ') { 
            console.log("Spacekey detected")
            
            loadModel('https://example.com/model.json')
                .then(model => {
                    predictNextWord(model, 'hello world')
                    .then(predictedWords => console.log(predictedWords))
                    .catch(error => console.error(error));
                })
                .catch(error => console.error(error));
        }
    };

    /*async function predictNextWord() {
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
    }*/

    async function loadModel(url) {
        try {
            const model = await tf.loadLayersModel(url);
            return model;
        } catch (error) {
            console.error('Error loading model:', error);
            return null;
        }
        }

    async function predictNextWord() {
        try {
            // Preprocess input text
            const input = tf.tensor2d([inputText.split(' ').map(word => word.charCodeAt(0))], [1, inputText.length]);
        
            // Make prediction
            const output = await model.predict(input);
        
            // Get top 5 predictions
            const predictions = await output.topK(5);
        
            // Convert predictions to words
            const predictedWords = predictions.indices.dataSync().map(index => String.fromCharCode(index));
        
            return predictedWords;
        } catch (error) {
            console.error('Error making prediction:', error);
            return null;
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
