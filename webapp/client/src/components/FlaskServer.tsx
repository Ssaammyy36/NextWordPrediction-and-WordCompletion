import React, { useState, useEffect } from "react";

const serverUrl = "http://192.168.178.78:5000/predict";

function FlaskServer({ inputText, startPrediction, setStartPrediction, setPrediction }) {
  
  const [allPredictions, setAllPredictions] = useState([]);
  const [isSending, setIsSending] = useState(false); 
  const [error, setError] = useState([]);

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
      setError(error.message || error.toString());
    }
  };

  useEffect(() => {
    if (startPrediction) {
      sendTextToServer();
    }
  }, [startPrediction]);

  return (
    <div>
      <h3>Flask Server</h3>
      {isSending ? (
        <p>Sending ...</p>
      ) : (
        <div>
          <p>Bereit</p>
        </div>
      )}
      
      {/* Fehleranzeige */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button 
        type="button" 
        className="btn btn-outline-primary mb-3"
        onClick={sendTextToServer}
      >Sende Nachricht an Server</button>

    </div>
  );
  
}

export default FlaskServer;
