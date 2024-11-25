import React, { useState, useEffect } from "react";

function FlaskServer({ inputText, startPrediction, setStartPrediction }) {
  const [message, setMessage] = useState("");

  const sendTextToServer = async () => {
    console.log("Sende Daten an den Flask-Server");
    try {
      const response = await fetch("http://127.0.0.1:5000/input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText: inputText }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Fehler beim Senden der Daten:", error);
    }
  };

  useEffect(() => {
    if (startPrediction) {
      sendTextToServer();
      setStartPrediction(false); // Optional: Zurücksetzen des Flags
    }
  }, [startPrediction]); // Abhängig vom startPrediction-Flag

  return (
    <div>
      <h3>Flask Server</h3>
      <p>{message ? message : "Warte auf Antwort..."}</p>
    </div>
  );
}

export default FlaskServer;
