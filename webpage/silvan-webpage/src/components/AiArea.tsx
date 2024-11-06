import * as tf from '@tensorflow/tfjs';
import { useState, useEffect } from 'react';

// Variablen
const modelPath = '/lstm_js/model.json';
const exampleSentence = "Hallo wie geht";

// Komponente
function AiArea() {
  const [output, setOutput] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isPredicting, setPredicting] = useState(false); 

  // Funktion zum Laden des Modells
  const loadModel = async (modelPath) => {
    let cachedModel = null;
    if (!cachedModel) {
      setIsLoading(true); 
      console.log("Lade das Modell...");
      try {
        cachedModel = await tf.loadLayersModel(modelPath);
        setIsLoading(false); 
        console.log("Modell erfolgreich geladen");
      } catch (error) {
        console.error("Fehler beim Laden des Modells:", error);
        setIsLoading(false); 
      }
    } else {
      console.log("Modell aus Cache verwendet");
    }
    return cachedModel;
  };

  // Funktion für Wortvorhersage
  const makePrediction = async (model, exampleSentence) => {
    const tokenizedSentence = exampleSentence.split(' ');
    const inputTensor = tf.tensor2d([tokenizedSentence.map(word => word.length)]); 

    setPredicting(true); 
    console.log("Startet Vorhersage...");
    const prediction = model.predict(inputTensor);
      
    const predictedData = prediction.dataSync(); 
    setOutput(predictedData); 
    setPredicting(false);
    console.log(`Vorhersage: ${predictedData}`);
  };

  // Ausführen beim ersten Rendern
  useEffect(() => {
    const loadAndPredict = async () => {
      const model = await loadModel(modelPath); 
      makePrediction(model, exampleSentence); 
    };
    loadAndPredict(); 
  }, []); 

  return (
    <div>
      <h1>AI Area</h1>
      <p>Input: {exampleSentence}</p>
      <p>Output: {isLoading ? 'Lade Modell und mache Vorhersage...' : isPredicting ? 'Mache Vorhersage...' : output ? output.join(', ') : 'Keine Vorhersage möglich'}</p>
    </div>
  );
};

export default AiArea;
