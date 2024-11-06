import * as tf from '@tensorflow/tfjs';
import { useState, useEffect } from 'react';

// Variablen
const modelPath = 'models/lstm_js/model.json';
const exampleSentence = "Hallo wie geht";

// Komponente
function AiArea() {
  const [model, setModel] = useState(null); 
  const [output, setOutput] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isPredicting, setPredicting] = useState(false); 

  // Funktion zum Laden des Modells
  const loadModel = async (modelPath) => {
    if (!model) {
      setIsLoading(true); 
      console.log("Lade das Modell...");
      try {
        //const cachedModel = await tf.loadLayersModel(modelPath);
        const loadedModel = await tf.loadGraphModel(modelPath);
        setModel(loadedModel);
        setIsLoading(false); 
        console.log("Modell erfolgreich geladen");
        console.log(loadedModel);
      } catch (error) {
        console.error("Fehler beim Laden des Modells:", error);
        setIsLoading(false); 
      }
    } else {
      console.log("Modell aus Cache verwendet");
    }
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

  // Ausführen bei ersten Render
  useEffect(() => {
    loadModel(modelPath); 
  }, []);

  return (
    <div>
      <h1>AI Area</h1>
      <p>Input: {exampleSentence}</p>
      <p>Output: {isLoading ? 'Ladet Modell' : isPredicting ? 'Macht Vorhersage' : output ? output.join(', ') : 'Keine Vorhersage möglich'}</p>
    </div>
  );
};

export default AiArea;
