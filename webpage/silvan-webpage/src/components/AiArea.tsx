import * as tf from '@tensorflow/tfjs';
import { useState, useEffect } from 'react';

// Variablen
const modelPath = 'models/lstm_js/model.json';
const exampleSentence = "Hallo ich bin";
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
function AiArea() {
  const [model, setModel] = useState(null); 
  const [tokenizer, setTokenizer] = useState(null);  // Tokenizer im Zustand speichern
  const [output, setOutput] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isPredicting, setPredicting] = useState(false); 

  // Modell laden
  const loadModel = async (modelPath) => {
    setIsLoading(true); 
    console.log("Lade das Modell...");
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
  const makePrediction = async (exampleSentence) => {
    if (model && tokenizer) {
        setPredicting(true); 
        console.log("Start der Vorhersage...");

        // Tokenisiere den Beispiel-Satz und wende Padding an
        const tokenizedSentence = tokenizer.textsToSequences([exampleSentence])[0];
        
        // Sicherstellen, dass die Eingabedaten genau 8 Tokens haben (Padding am Anfang)
        const paddedSentence = [
            ...Array(maxSequenceLength - tokenizedSentence.length).fill(0),  // Padding am Anfang
            ...tokenizedSentence
        ].slice(0, maxSequenceLength);  // Wenn mehr als 8 Tokens vorhanden sind, auf 8 kürzen

        console.log("Padded Sentence:", paddedSentence);

        // In Tensor umwandeln
        const inputTensor = tf.tensor2d([paddedSentence]);

        // Vorhersage mit executeAsync
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

            // Ausgabe der 10 wahrscheinlichsten Wörter
            console.log("Top 10 wahrscheinlichste Wörter:", top10Words);

            setOutput(top10Words);  // Ausgabe speichern
            setPredicting(false);  // Vorhersage-Status deaktivieren
        } catch (error) {
            console.error("Fehler bei der Vorhersage:", error);
            setPredicting(false);
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
    if (model && tokenizer) {
      makePrediction(exampleSentence);  // Vorhersage auf Beispiel-Satz machen
    }
  }, [model, tokenizer]);  // Nur ausführen, wenn Modell und Tokenizer verfügbar sind

  return (
    <div>
      <h1>AI Area</h1>
      <p>Input: {exampleSentence}</p>
      <p>Output: {isLoading ? 'Ladet Modell...' : isPredicting ? 'Macht Vorhersage...' : output ? output.join(', ') : 'Keine Vorhersage möglich'}</p>
    </div>
  );
};

export default AiArea;
