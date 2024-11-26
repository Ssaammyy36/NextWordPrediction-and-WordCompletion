import React, { useState, useEffect } from "react";

const serverUrl = "http://127.0.0.1:5000/predict";

function FlaskServer({ inputText, startPrediction, setStartPrediction, setPrediction }) {
  
  const [allPredictions, setAllPredictions] = useState([]);
  const [isSending, setIsSending] = useState(false); 

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
    }
  };

  useEffect(() => {
    if (startPrediction) {
      sendTextToServer();
    }
  }, [startPrediction]);

  return (
    <div>
      <h3>Top 10 Predictions:</h3>
      {isSending ? (
        <p>Loading...</p>
      ) : (
        <div>
           <p>Bereit</p>
        </div>
      )}
    </div>
  );
  
}

export default FlaskServer;
