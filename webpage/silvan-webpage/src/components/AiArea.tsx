import * as tf from '@tensorflow/tfjs'; 
import { useState, useEffect } from 'react';

// Variablen
const modelPath = 'models/lstm_js/model.json';
const exampleSentence = "Hallo wie geht";

function AiArea() {
  const [model, setModel] = useState(null); 
  const [output, setOutput] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isPredicting, setPredicting] = useState(false); 

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
    if (model) {
      setPredicting(true);  // Vorhersage-Status aktivieren
      console.log("Start der Vorhersage...");
  
      // Tokenisiere die Eingabedaten (hier das Splitten nach Leerzeichen)
      const tokenizedSentence = sentence.split(' ');
  
      // Überprüfe die Länge der tokenisierten Eingabedaten und sorge dafür, dass die Eingabe genau 8 Merkmale hat.
      // Wenn weniger als 8 Tokens vorhanden sind, fülle mit Nullen auf (Padding).
      const paddedSentence = [
        ...tokenizedSentence.map(word => word.length), // Hier benutze ich die Wortlänge, aber normalerweise würdest du ein Vokabular oder Tokenizer verwenden
        ...Array(8 - tokenizedSentence.length).fill(0)  // Padding, um die Eingabe auf 8 Merkmale zu erweitern
      ];
  
      // Nun sicherstellen, dass die Eingabedaten die Form von [1, 8] haben
      const inputTensor = tf.tensor2d([paddedSentence]);
  
      // Vorhersage mit dem Modell (verwende executeAsync anstelle von predict)
      try {
        const prediction = await model.executeAsync(inputTensor);
  
        // Daten aus der Vorhersage abrufen
        const predictedData = prediction.dataSync();
        setOutput(predictedData);  // Ergebnis speichern
  
        setPredicting(false);  // Vorhersage-Status deaktivieren
        console.log("Vorhersage abgeschlossen:", predictedData);
      } catch (error) {
        console.error("Fehler bei der Vorhersage:", error);
        setPredicting(false);
      }
    } else {
      console.log("Modell noch nicht geladen.");
    }
  };
  

  // Effekt, der ausgeführt wird, wenn das Modell erfolgreich geladen wurde
  useEffect(() => {
    loadModel(modelPath);  // Modell laden

  }, []);  // Dieser Effekt wird nur einmal ausgeführt, wenn die Komponente geladen wird

  // Wenn das Modell geladen ist, Vorhersage machen
  useEffect(() => {
    if (model) {
      makePrediction(exampleSentence);  // Vorhersage auf den Beispiel-Satz machen
    }
  }, [model]);  // Nur ausführen, wenn das Modell im Zustand verfügbar ist

  return (
    <div>
      <h1>AI Area</h1>
      <p>Input: {exampleSentence}</p>
      <p>Output: {isLoading ? 'Ladet Modell...' : isPredicting ? 'Macht Vorhersage...' : output ? output.join(', ') : 'Keine Vorhersage möglich'}</p>
    </div>
  );
};

export default AiArea;
