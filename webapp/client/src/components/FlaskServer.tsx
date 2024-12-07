import React, { useState, useEffect } from "react";


// const SERVER_URL = "http://localhost:5000/"; // Local
const SERVER_URL = "http://192.168.178.78:5000/"; // Home
// const SERVER_URL = "http://192.168.0.50:5000/"; // Kathi WG

const PREDICT_URL = SERVER_URL + "predict";
const CHECK_STATUS_URL = SERVER_URL + "checkStatus";

function FlaskServer({ inputText, startPrediction, setStartPrediction, setPrediction, startAutocomplete, setStartAutocomplete, setIsAutocompleting }) {
  
  const [allPredictions, setAllPredictions] = useState([]);
  const [isSending, setIsSending] = useState(false); 
  const [serverError, setServerError] = useState([]);
  const [isServerOnline, setIsServerOnline] = useState(null);

  const sendTextToServer = async () => {
    try {
      console.log("Sende Daten an den Flask-Server", inputText);
      setIsSending(true);
      const response = await fetch(PREDICT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText }),
      });

      setIsSending(false);
      const data = await response.json();
      console.log("Serverantwort:", data);

      const predictions = data.predictions.map((item) => ({
        word: item.word
      }));
      console.log("Extrahierte Daten:", predictions);
      setAllPredictions(predictions);

      const words = data.predictions.slice(0, 10).map((item) => item.word);
      setPrediction(words);

      setStartPrediction(false);
    } catch (error) {
      console.error("Fehler beim Senden der Daten:", error);
      setIsServerOnline(false);
      setServerError(error.message || error.toString());
    }
  };

  // Funktion, um den Serverstatus zu prüfen
  const checkServerStatus = async () => {
    try {
      const response = await fetch(CHECK_STATUS_URL);
  
      if (response.ok) {
        const statusText = await response.text();
        console.log("Server Status:", statusText); // Hier wird "Online" ausgegeben
        setIsServerOnline(statusText === "Online");
      } 
    } catch (error) {
      console.error("Server ist nicht erreichbar");
      setIsServerOnline(false);
      setServerError(error.message || error.toString());
    }
  };

  const autocomplete = (prefix) => {
    if (!Array.isArray(allPredictions) || allPredictions.length === 0 || !prefix) {
      console.log("allPredictions oder Prefix fehlen");
      return [];
    }
  
    console.log("Prefix:", prefix);
    console.log("Alle Vorhersagen:", allPredictions);
  
    const filteredWords = allPredictions
      .filter((item) =>
        item.word.trim().toLowerCase().startsWith(prefix.trim().toLowerCase())
      )
      .map((item) => item.word);
  
    const top10FilteredWords = filteredWords.slice(0, 10);
  
    console.log("Gefilterte Vorhersagen:", filteredWords);
    console.log("Top 10 Gefilterte Vorhersagen:", top10FilteredWords);
  
    setPrediction(top10FilteredWords);
    setStartAutocomplete(false);
    setIsAutocompleting(true);
  };
  
  

  // --------------------------------------------------------------------------------------------

  // Server testen 
  useEffect(() => {
    checkServerStatus();
  }, []);

  // Vorhersage starten 
  useEffect(() => {
    if (startPrediction) {
      sendTextToServer();
    }
  }, [startPrediction]);

   // Autocomplete starten
   useEffect(() => {
    if (startAutocomplete && inputText.trim() !== '') {

        // Wörter und Prefix extrahieren
        const words = inputText.trim().split(/\s+/);  
        const prefix = words[words.length - 1];  

        // Prüfen, ob das letzte Wort ohne Leerzeichen endet
        if (prefix && !inputText.endsWith(" ")) {  
            autocomplete(prefix);  
        }
    }
}, [startAutocomplete, inputText]);

// --------------------------------------------------------------------------------------------

  return (
    <div>
      <h3>Flask-Server Status</h3>
      {isServerOnline === null ? (
          <p>Überprüfe den Serverstatus...</p>
      ) : isSending ? (
          <p>Die Daten werden gesendet ...</p>
      ) : isServerOnline ? (
          <p>Der Server ist online 👌</p>
      ) : (
          <p>Der Server ist offline 😴 <br></br> Fehler: {serverError}</p>
      )}
    
    </div>
);
  
}

export default FlaskServer;
