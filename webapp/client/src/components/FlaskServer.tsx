import React, { useState, useEffect } from "react";

// ====================================================================================
// Server Configuration
// ====================================================================================
// Use a single source for the server URL to make it easily configurable.
// Comment out the lines you are not using.
const SERVER_URL = "http://localhost:5000/"; // For local development
// const SERVER_URL = "http://192.168.178.78:5000/"; // Example: Home network
// const SERVER_URL = "http://192.168.0.50:5000/"; // Example: Other network

const PREDICT_URL = SERVER_URL + "predict";
const CHECK_STATUS_URL = SERVER_URL + "checkStatus";

/**
 * This component acts as a bridge between the UI components and the Python/Flask backend.
 * It handles API calls for predictions and server status checks.
 */
function FlaskServer({ 
  inputText, 
  startPrediction, 
  setStartPrediction, 
  setPrediction, 
  startAutocomplete, 
  setStartAutocomplete, 
  setIsAutocompleting 
}) {
  
  // State to hold all predictions returned from the server (for autocomplete filtering).
  const [allPredictions, setAllPredictions] = useState([]);
  // State to track if a request is currently in-flight.
  const [isSending, setIsSending] = useState(false); 
  // State to store any server-related errors.
  const [serverError, setServerError] = useState(null);
  // State to track the server's online status (null = unchecked, true = online, false = offline).
  const [isServerOnline, setIsServerOnline] = useState(null);

  /**
   * Sends the current input text to the Flask server to get word predictions.
   */
  const sendTextToServer = async () => {
    // Prevent sending requests if one is already in progress.
    if (isSending) return;

    try {
      console.log(`Sending data "${inputText}" to Flask server...`);
      setIsSending(true);
      setServerError(null); // Clear previous errors.

      const response = await fetch(PREDICT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Server response:", data);

      // Store the full list of predictions for client-side filtering.
      setAllPredictions(data.predictions || []);

      // Update the parent component with the top 10 predictions to display.
      const top10Words = (data.predictions || []).slice(0, 10).map(item => item.word);
      setPrediction(top10Words);

    } catch (error) {
      console.error("Error sending data:", error);
      setIsServerOnline(false);
      setServerError(error.message || "An unknown error occurred.");
    } finally {
      // Reset states after the request is complete.
      setIsSending(false);
      setStartPrediction(false);
    }
  };

  /**
   * Checks if the Flask server is online by hitting a simple status endpoint.
   */
  const checkServerStatus = async () => {
    try {
      console.log("Checking server status...");
      const response = await fetch(CHECK_STATUS_URL);
      if (response.ok) {
        const statusText = await response.text();
        setIsServerOnline(statusText === "Online");
      } else {
        setIsServerOnline(false);
      }
    } catch (error) {
      console.error("Server is not reachable:", error);
      setIsServerOnline(false);
      setServerError(error.message || "Server is offline.");
    }
  };

  /**
   * Filters the `allPredictions` list on the client-side based on a prefix.
   * This provides fast autocomplete without needing a new server request for every letter.
   */
  const autocomplete = (prefix) => {
    if (!Array.isArray(allPredictions) || allPredictions.length === 0 || !prefix) {
      setPrediction([]); // Clear predictions if there's nothing to filter
      return;
    }
  
    console.log("Autocomplete prefix:", prefix);
  
    const filteredWords = allPredictions
      .filter((item) =>
        item.word.trim().toLowerCase().startsWith(prefix.trim().toLowerCase())
      )
      .map((item) => item.word);
  
    const top10FilteredWords = filteredWords.slice(0, 10);
    console.log("Filtered top 10:", top10FilteredWords);
  
    // Update the displayed predictions.
    setPrediction(top10FilteredWords);
    setStartAutocomplete(false);
    setIsAutocompleting(true);
  };
  
  // ====================================================================================
  // Effects
  // ====================================================================================

  // Check server status once when the component mounts.
  useEffect(() => {
    checkServerStatus();
  }, []);

  // Trigger a server prediction when the parent component requests it.
  useEffect(() => {
    if (startPrediction) {
      sendTextToServer();
    }
  }, [startPrediction]);

   // Trigger client-side autocomplete when the parent requests it.
   useEffect(() => {
    if (startAutocomplete && inputText.trim() !== '') {
        const words = inputText.trim().split(/\s+/);  
        const prefix = words[words.length - 1];  

        // Only run autocomplete if there is a prefix and the user hasn't just typed a space.
        if (prefix && !inputText.endsWith(" ")) {  
            autocomplete(prefix);  
        }
    }
  }, [startAutocomplete, inputText]);

  // ====================================================================================
  // Render
  // ====================================================================================

  return (
    <div>
      <h3>Flask-Server Status</h3>
      {isServerOnline === null ? (
          <p>Checking server status...</p>
      ) : isSending ? (
          <p>Sending data...</p>
      ) : isServerOnline ? (
          <p>Server is online 👌</p>
      ) : (
          <p>Server is offline 😴 <br/> Error: {serverError}</p>
      )}
    </div>
  );
}

export default FlaskServer;