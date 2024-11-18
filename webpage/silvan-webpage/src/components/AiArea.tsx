import * as tf from '@tensorflow/tfjs';
import { useState, useEffect } from 'react';

// Variablen
const modelPath = 'public/models/colab_lstm/lstm_js/model.json';
const wordIndexPath = 'public/models/colab_lstm/lstm_js/tokenizer_word_index.json';    

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
function AiArea({inputText, setPrediction, startPrediction, setStartPrediction, startAutocomplete, setStartAutocomplete, setIsAutocompleting}) {

  const [model, setModel] = useState(null); 
  const [tokenizer, setTokenizer] = useState(null);  // Tokenizer im Zustand speichern
  const [maxSequenceLength, setMaxSequenceLength] = useState(null);

  const [isLoading, setIsLoading] = useState(true);  // Initial auf true setzen, um Ladeanzeige zu zeigen
  const [isPredicting, setIsPredicting] = useState(false); 

  const [allPredictions, setAllPredictions] = useState([]);

  // Modell und Tokenizer laden
  const loadAssets = async () => {
    try {

      // Modell laden, falls noch nicht vorhanden
      if (!model) {
        console.log("Ladet das Modell ...");
        const loadedModel = await tf.loadGraphModel(modelPath);  
        setModel(loadedModel);  
        console.log("Modell erfolgreich geladen");

        // Input-Shape auslesen und maxSequenceLength setzen
        const inputShape = loadedModel.inputs[0].shape;
        console.log("Input-Shape des Modells:", inputShape);
        setMaxSequenceLength(inputShape[1]);  
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

  // Funktion zum Autocomplete
  const autocomplete = (prefix) => {
    // Überprüfe, ob allPredictions und der Prefix vorhanden sind
    if (!Array.isArray(allPredictions) || allPredictions.length === 0 || !prefix) {
        console.log("allPredictions oder Prefix fehlen");
        return [];
    } else {

      // Filtere die Wörter basierend auf dem Prefix
      const filteredWords = allPredictions.filter(word => typeof word === 'string' && word.startsWith(prefix));
      const top10FilteredWords = filteredWords.slice(0, 10);

      console.log("Eingabe-Präfix:", prefix);
      console.log("Gefilterte Vorhersagen:", top10FilteredWords);

      setPrediction(top10FilteredWords);
      setStartAutocomplete(false);  // Setze das Flag zurück, um weitere Autocomplete-Versuche zu starten
      setIsAutocompleting(true);
    }
};

  // Funktion für Vorhersage
  const makePrediction = async (inputText) => { 
    if (model && tokenizer && inputText !== '') {
        setIsPredicting(true); 
        console.log("Start der Vorhersage...");

        try {
            // Input tokenisieren
            const tokenizedSentence = tokenizer.textsToSequences([inputText])[0];
            const paddedSentence = [
                ...Array(maxSequenceLength - tokenizedSentence.length).fill(0),  
                ...tokenizedSentence
            ].slice(0, maxSequenceLength);  
            const inputTensor = tf.tensor2d([paddedSentence]);

            // Vorhersage durchführen
            const prediction = await model.executeAsync(inputTensor);

            // Ausgabe verarbeiten
            const predictionArray = prediction.dataSync();        // Tensor in Array konvertieren
            const sortedIndices = Array.from(predictionArray)
                .map((prob, index) => ({ index, prob }))  
                .sort((predictionA, predicitonB) => predicitonB.prob - predictionA.prob);            // Wörter absteigend sortieren nach Wahrscheinlaichzeiten

            // Alle Wörter
            const allWords = sortedIndices.map(item => tokenizer.indexWord[item.index]);

            // Top 10
            const top10 = sortedIndices.slice(0, 10); 
            const top10Words = top10.map(item => tokenizer.indexWord[item.index]);

            setPrediction(top10Words); 
            setAllPredictions(allWords);
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

  // Vorhersage starten
  useEffect(() => {
    if (startPrediction && model && tokenizer && inputText.trim() !== '') {
        makePrediction(inputText);
    }
  }, [startPrediction, inputText, model, tokenizer]);  // Vorhersage wird nur gemacht, wenn alle Voraussetzungen erfüllt sind

  // Autocomplete starten
  useEffect(() => {
    if (startAutocomplete && model && tokenizer && inputText.trim() !== '') {

        // Wörter und Prefix extrahieren
        const words = inputText.trim().split(/\s+/);  
        const prefix = words[words.length - 1];  

        // Prüfen, ob das letzte Wort ohne Leerzeichen endet
        if (prefix && !inputText.endsWith(" ")) {  
            autocomplete(prefix);  
        }
    }
}, [startAutocomplete, inputText, model, tokenizer]);


  return (
    <div className="mt-10">
      <h3>AI Area</h3>

      <div>
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
    </div>
  );
};

export default AiArea;
