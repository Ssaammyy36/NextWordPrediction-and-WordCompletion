import * as tf from '@tensorflow/tfjs';
import { useState, useEffect } from 'react';

// Variablen
const modelPath = 'models/lstm_js/model.json';
//const inputText = "Hallo ich bin";
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
    const response = await fetch(wordIndexPath);
    const wordIndex = await response.json();
    return new Tokenizer(wordIndex);
  }
}

// Hauptkomponente
function AiArea({inputText, setPrediction, startPrediction, setStartPrediction}) {
  const [model, setModel] = useState(null); 
  const [tokenizer, setTokenizer] = useState(null);  // Tokenizer im Zustand speichern
  const [isLoading, setIsLoading] = useState(false); 
  const [isPredicting, setIsPredicting] = useState(false); 

  // Modell laden
  const loadModel = async (modelPath) => {
    setIsLoading(true); 
    console.log("Ladet das Modell ...");
    try {
      const loadedModel = await tf.loadGraphModel(modelPath);  // Modell laden
      setModel(loadedModel);  // Modell in Zustand speichern
      setIsLoading(false); 
      console.log("Modell erfolgreich geladen");
    } catch (error) {
      console.error("Fehler beim Laden des Modells:", error);
      setIsLoading(false); 
    }
  };


  // Funktion für Vorhersage
  const makePrediction = async (inputText) => {
    if (model && tokenizer && inputText !== '') {
        setIsPredicting(true); 
        console.log("Start der Vorhersage...");

        const tokenizedSentence = tokenizer.textsToSequences([inputText])[0];
        const paddedSentence = [
            ...Array(maxSequenceLength - tokenizedSentence.length).fill(0),  // Padding am Anfang
            ...tokenizedSentence
        ].slice(0, maxSequenceLength);  // Wenn mehr als 8 Tokens vorhanden sind, auf 8 kürzen
        const inputTensor = tf.tensor2d([paddedSentence]);

        try {
            const prediction = await model.executeAsync(inputTensor);

            // Extrahieren der Wahrscheinlichkeiten und Sortieren
            const predictedData = prediction.dataSync();
            const sortedIndices = Array.from(predictedData)
                .map((prob, index) => ({ index, prob }))
                .sort((a, b) => b.prob - a.prob);

            // Top 10 Wahrscheinlichkeiten extrahieren
            const top10 = sortedIndices.slice(0, 10);

            // Indizes in Wörter umwandeln
            const top10Words = top10.map(item => tokenizer.indexWord[item.index]);
            setPrediction (top10Words);  // Ausgabe speichern
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

  

  // Effekt, der das Modell und den Tokenizer lädt
  useEffect(() => {
    loadModel(modelPath);  // Modell laden
    Tokenizer.load(wordIndexPath).then(setTokenizer); // Tokenizer laden
  }, []);  // Wird nur einmal beim Laden der Komponente ausgeführt

  // Vorhersage nach dem Laden des Modells und Tokenizers
  useEffect(() => {
    if (startPrediction && model && tokenizer && inputText.trim() !== '') {
        // Vorhersage nur einmal auslösen, wenn startPrediction von false auf true geht
        makePrediction(inputText);
    }
}, [startPrediction, inputText, model, tokenizer]);

  return (
    <div>
      <h1>AI Area</h1>
      <p>Ladezustand: {isLoading ? 'Ladet Modell...' : isPredicting ? 'Berechnet Vorhersage ...' : 'Bereit ...'}</p>
    </div>
  );
};

export default AiArea;
