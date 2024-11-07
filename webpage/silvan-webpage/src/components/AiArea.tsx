import * as tf from '@tensorflow/tfjs';
import { useState, useEffect } from 'react';

// Variablen
const modelPath = 'models/lstm_js/model.json';
const wordIndexPath = 'tokenizer_word_index.json';
const maxSequenceLength = 9;                          // 10 - 1 = 9 

// Tokenizer initialisieren
class Tokenizer {
  constructor(wordIndex) {
    this.wordIndex = wordIndex;
    this.indexWord = Object.fromEntries(Object.entries(wordIndex).map(([word, index]) => [index, word]));
  }

  textsToSequences(texts) {
    return texts.map(text => text.split(' ').map(word => this.wordIndex[word] || 0)); // Wenn Wort nicht im Index, setze es auf 0
  }

  // Funktion, um das Tokenizer-Modell aus einer JSON-Datei zu laden
  static async load(wordIndexPath) {
    try {
      console.log("Ladet Tokenizer ...");
      const response = await fetch(wordIndexPath);
      const wordIndex = await response.json();
      return new Tokenizer(wordIndex);
    } catch (error) {
      console.log("Fehler beim Laden des Tokenizers:", error);
    }
  }
}

// Hauptkomponente
function AiArea({inputText, setPrediction, startPrediction, setStartPrediction}) {

  const [model, setModel] = useState(null); 
  const [tokenizer, setTokenizer] = useState(null);  // Tokenizer im Zustand speichern
  const [isLoading, setIsLoading] = useState(true);  // Initial auf true setzen, um Ladeanzeige zu zeigen
  const [isPredicting, setIsPredicting] = useState(false); 

  // Modell und Tokenizer laden
  const loadAssets = async () => {
    try {

      // Modell laden, falls noch nicht vorhanden
      if (!model) {
        console.log("Ladet das Modell ...");
        const loadedModel = await tf.loadGraphModel(modelPath);  
        setModel(loadedModel);  
        console.log("Modell erfolgreich geladen");
      }

      // Tokenizer laden, falls noch nicht vorhanden
      if (!tokenizer) {
        console.log("Ladet Tokenizer ...");
        const loadedTokenizer = await Tokenizer.load(wordIndexPath);  
        setTokenizer(loadedTokenizer); 
        console.log("Tokenizer erfolgreich geladen");
      }
    } catch (error) {
      console.error("Fehler beim Laden des Modells oder Tokenizers:", error); 
    } finally {
      setIsLoading(false);  
    }
  };

  // same comments 

  // Funktion für Vorhersage
  const makePrediction = async (inputText) => {
    if (model && tokenizer && inputText !== '') {
        setIsPredicting(true); 
        console.log("Start der Vorhersage...");

        try {
            // Input Tokenisieren
            const tokenizedSentence = tokenizer.textsToSequences([inputText])[0];
            const paddedSentence = [
                ...Array(maxSequenceLength - tokenizedSentence.length).fill(0),  
                ...tokenizedSentence
            ].slice(0, maxSequenceLength);  
            const inputTensor = tf.tensor2d([paddedSentence]);

            // Vorhersage durchfürfen
            const prediction = await model.executeAsync(inputTensor);

            // Ausgabe verarbeiten
            const predictedData = prediction.dataSync();
            const sortedIndices = Array.from(predictedData)
                .map((prob, index) => ({ index, prob }))  
            .sort((a, b) => b.prob - a.prob); 
            const top10 = sortedIndices.slice(0, 10); 
            const top10Words = top10.map(item => tokenizer.indexWord[item.index]);

            setPrediction(top10Words); 
            console.log("Top 10 wahrscheinlichste Wörter:", top10Words);
        } catch (error) {
            console.error("Fehler bei der Vorhersage:", error);
        } finally {
            setIsPredicting(false);
            setStartPrediction(false); 
        }
    } else {
        console.log("Modell oder Tokenizer noch nicht geladen.");
    }
};

// ----------------------------------------------------------------------------------------------------------

  // Laden des Modells und Tokenizers nur einmal beim Initialisieren
  useEffect(() => {
    if (!model && !tokenizer) {
      loadAssets();  // Lade Modell und Tokenizer nur einmal
    }
  }, []);  // Leeres Abhängigkeitsarray sorgt dafür, dass es nur einmal beim Initialisieren geladen wird

  // Vorhersage starten, wenn alle Voraussetzungen erfüllt sind
  useEffect(() => {
    if (startPrediction && model && tokenizer && inputText.trim() !== '') {
        makePrediction(inputText);
    }
  }, [startPrediction, inputText, model, tokenizer]);  // Vorhersage wird nur gemacht, wenn alle Voraussetzungen erfüllt sind

  return (
    <div>
      <h1>AI Area</h1>

      {/* Ladeanzeige, wenn das Modell geladen wird */}
      {isLoading ? (
        <div className="d-flex align-items-center">
          <div className="spinner-grow text-primary" role="status">
          </div>
        </div>
      ) : isPredicting ? (
        // Spinner während der Vorhersage
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-warning" role="status">
            <span>Predicting ...</span>
          </div>
        </div>
      ) : (
        <p>Modell bereit ...</p>
      )}
    </div>
  );
};

export default AiArea;
