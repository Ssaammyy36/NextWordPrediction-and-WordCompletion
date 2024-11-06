import * as tf from '@tensorflow/tfjs'; 
import { useState, useEffect } from 'react';

// Variablen
const modelPath = 'models/lstm_js/model.json';
const exampleSentence = "Hallo ich bin";

// Tokenizer-Klasse, um den 'word_index' zu verwenden
class Tokenizer {
  constructor(wordIndex) {
    this.wordIndex = wordIndex;
    this.indexWord = Object.fromEntries(Object.entries(wordIndex).map(([key, value]) => [value, key]));
  }

  textsToSequences(texts) {
    return texts.map(text => {
      return text.split(' ').map(word => this.wordIndex[word] || 0); // 0 für unbekannte Wörter
    });
  }
}

// Deine Komponente
function AiArea() {
  const [model, setModel] = useState(null); 
  const [output, setOutput] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isPredicting, setPredicting] = useState(false); 
  const [tokenizer, setTokenizer] = useState(null);  // Zustand für den Tokenizer

  // Funktion zum Laden des Modells
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

  // Funktion für Wortvorhersage
  const makePrediction = async (sentence) => {
    if (model && tokenizer) {
      setPredicting(true); 
      console.log("Start der Vorhersage...");
      
      // Tokenisierung der Eingabe
      const tokenizedSentence = tokenizer.textsToSequences([sentence])[0];
      
      // Überprüfe die Länge der tokenisierten Eingabedaten und sorge dafür, dass die Eingabe genau 8 Merkmale hat.
      // Wenn weniger als 8 Tokens vorhanden sind, fülle mit Nullen auf (Padding).
      const paddedSentence = [
        ...tokenizedSentence,
        ...Array(8 - tokenizedSentence.length).fill(0)  // Padding, um die Eingabe auf 8 Merkmale zu erweitern
      ];
      
      // Nun sicherstellen, dass die Eingabedaten die Form von [1, 8] haben
      const inputTensor = tf.tensor2d([paddedSentence]);
      
      // Vorhersage mit dem Modell (verwende executeAsync anstelle von predict)
      try {
        const prediction = await model.executeAsync(inputTensor);
        
        // Daten aus der Vorhersage abrufen
        const predictedData = prediction.dataSync();  // Dies ist der Vektor der Wahrscheinlichkeiten
        
        // Um die 10 wahrscheinlichsten Wörter zu erhalten, sortiere die Indizes nach den höchsten Wahrscheinlichkeiten
        const sortedIndices = Array.from(predictedData)
          .map((prob, index) => ({ index, prob }))  // Paare von Index und Wahrscheinlichkeit
          .sort((a, b) => b.prob - a.prob)  // Absteigend nach Wahrscheinlichkeit sortieren
        
        // Extrahiere die 10 besten Ergebnisse
        const top10 = sortedIndices.slice(0, 10);
        
        // Konvertiere die Indizes zurück in Wörter
        const top10Words = top10.map(item => tokenizer.indexWord[item.index]);
        
        // Ausgabe der 10 wahrscheinlichsten Wörter
        console.log("Top 10 wahrscheinlichste Wörter:", top10Words);
        
        setOutput(top10Words);  // Ausgabe speichern
  
        setPredicting(false);  // Vorhersage-Status deaktivieren
        console.log("Vorhersage abgeschlossen:", top10Words);
      } catch (error) {
        console.error("Fehler bei der Vorhersage:", error);
        setPredicting(false);
      }
    } else {
      console.log("Modell oder Tokenizer noch nicht geladen.");
    }
  };
  
  
  // Funktion zum Laden des Tokenizers
  const loadTokenizer = async () => {
    const response = await fetch('tokenizer_word_index.json');  // Pfad zur gespeicherten JSON-Datei
    const wordIndex = await response.json();
    const tokenizerInstance = new Tokenizer(wordIndex);
    setTokenizer(tokenizerInstance);  // Tokenizer im Zustand speichern
  };

  // Effekt, der ausgeführt wird, wenn das Modell erfolgreich geladen wurde
  useEffect(() => {
    loadModel(modelPath);  // Modell laden
    loadTokenizer();  // Tokenizer laden
  }, []);  // Dieser Effekt wird nur einmal ausgeführt, wenn die Komponente geladen wird

  // Wenn das Modell und der Tokenizer geladen sind, Vorhersage machen
  useEffect(() => {
    if (model && tokenizer) {
      makePrediction(exampleSentence);  // Vorhersage auf den Beispiel-Satz machen
    }
  }, [model, tokenizer]);  // Nur ausführen, wenn das Modell und der Tokenizer im Zustand verfügbar sind

  return (
    <div>
      <h1>AI Area</h1>
      <p>Input: {exampleSentence}</p>
      <p>Output: {isLoading ? 'Ladet Modell...' : isPredicting ? 'Macht Vorhersage...' : output ? output.join(', ') : 'Keine Vorhersage möglich'}</p>
    </div>
  );
};

export default AiArea;
