import React, { useState, useEffect } from "react";

function FlaskServer() {
  const [message, setMessage] = useState("");

  // Fetch die Nachricht vom Flask-Server
  useEffect(() => {
    fetch("http://127.0.0.1:5000/test") // Flask läuft standardmäßig auf diesem Port
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message); // Setze die Antwort vom Flask-Server
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Leeres Array stellt sicher, dass der Effekt nur einmal beim Laden der Komponente ausgeführt wird

  return (
    <div>
      <h3>Flask Server</h3>
      <p>{message ? message : "Loading..."}</p> {/* Zeigt die Nachricht an oder 'Loading...' */}
    </div>
  );
}

export default FlaskServer;
