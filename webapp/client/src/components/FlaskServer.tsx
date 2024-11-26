import React, { useState, useEffect } from "react";

const serverUrl = "http://192.168.178.78:5000/predict";

function FlaskServer({ inputText, startPrediction, setStartPrediction, setPrediction }) {
  
  const [allPredictions, setAllPredictions] = useState([]);
  const [isSending, setIsSending] = useState(false); 
  const [serverError, setServerError] = useState([]);
  const [isServerOnline, setIsServerOnline] = useState(null);

  const sendTextToServer = async () => {
    try {
      console.log("Sende Daten an den Flask-Server");
      setIsSending(true);
      const response = await fetch(serverUrl, {
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
      setServerError(error.message || error.toString());
    }
  };

  // Funktion, um den Serverstatus zu prüfen
  const checkServerStatus = async () => {
    try {
      const response = await fetch("http://192.168.178.78:5000/checkStatus");
  
      if (response.ok) {
        const statusText = await response.text();
        console.log("Server Status:", statusText); // Hier wird "Online" ausgegeben
        setIsServerOnline(statusText === "Online");
      } else {
        console.error("Server ist nicht erreichbar");
        setIsServerOnline(false);
      }
    } catch (error) {
      console.error("Fehler beim Überprüfen des Serverstatus:", error);
    }
  };

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

  return (
    <div>
      <h1>Flask-Server Status</h1>
      {isServerOnline === null ? (
          <p>Überprüfe den Serverstatus...</p>
      ) : isSending ? (
          <p>Die Daten werden gesendet...</p>
      ) : isServerOnline ? (
          <p>Der Server ist online!</p>
      ) : (
          <p>Der Server ist offline. Fehler: {errorMessage}</p>
      )}
    
    </div>
);
  
}

export default FlaskServer;
