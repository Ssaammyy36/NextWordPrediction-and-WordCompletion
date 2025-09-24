import React, { useState, useEffect, useCallback } from "react";
import { usePredictionContext } from "../context/PredictionContext";

// Server Configuration
const PREDICT_URL = "/api/predict";
const CHECK_STATUS_URL = "/api/checkStatus";
const STARTING_WORDS_URL = "/api/starting-words"; // New endpoint for starters

/**
 * This component acts as a bridge to the Python/Flask backend.
 * It handles API calls for predictions, server status, and initial data loading.
 */
function FlaskServer() {
    const {
        inputText,
        startPrediction,
        setStartPrediction,
        setPrediction,
        startAutocomplete,
        setStartAutocomplete,
        setIsAutocompleting
    } = usePredictionContext();

    const [allPredictions, setAllPredictions] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isServerOnline, setIsServerOnline] = useState<boolean | null>(null);

    /**
     * Sends the current input text to the Flask server to get word predictions.
     */
    const sendTextToServer = async () => {
        if (isSending) return;

        try {
            console.log(`Sending data "${inputText}" to Flask server...`);
            setIsSending(true);
            setServerError(null);

            const response = await fetch(PREDICT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputText }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            console.log("...Server response:", data);

            setAllPredictions(data.predictions || []);
            const top10Words = (data.predictions || []).slice(0, 10).map((item: { word: string }) => item.word);
            setPrediction(top10Words);

        } catch (error: any) {
            console.error("Error sending data:", error);
            setIsServerOnline(false);
            setServerError(error.message || "An unknown error occurred.");
        } finally {
            setIsSending(false);
            setStartPrediction(false);
        }
    };

    /**
     * Checks if the Flask server is online.
     */
    const checkServerStatus = async () => {
        try {
            console.log("Checking server status...");
            const response = await fetch(CHECK_STATUS_URL);
            if (response.ok) {
                const statusText = await response.text();
                setIsServerOnline(statusText === "Online");  // if response is "Online", set setIsServerOnline to true
                console.log("...Server status:", statusText);
            } else {
                setIsServerOnline(false);
            }
        } catch (error: any) {
            console.error("...Server is not reachable:", error);
            setIsServerOnline(false);
            setServerError(error.message || "Server is offline.");
        }
    };

    /**
     * Fetches the initial list of sentence starters.
     */
    const getStartingWords = useCallback(async () => {
        try {
            console.log("Fetching starting words...");
            const response = await fetch(STARTING_WORDS_URL);
            if (response.ok) {
                const data = await response.json();
                if (inputText === '' && data.starters) {
                    // Set the master list for the autocomplete function
                    console.log("...Received starting words:", data.starters);
                    setAllPredictions(data.starters);

                    // Set the display list (top 10)
                    const starterWords = data.starters
                        .slice(0, 10)
                        .map((item: { word: string }) => item.word);
                    setPrediction(starterWords);
                }
            }
        } catch (error: any) {
            console.error("Could not fetch starting words:", error);
        }
    }, [inputText, setAllPredictions, setPrediction]);

    /**
     * Filters predictions on the client-side for fast autocomplete.
     */
    const autocomplete = (prefix: string) => {
        if (!Array.isArray(allPredictions) || allPredictions.length === 0 || !prefix) {
            setPrediction([]);
            return;
        }

        console.log("Client-side autocomplete with prefix:", prefix);

        const filteredPredictions = allPredictions.filter((item: { word: string }) =>
            item.word.trim().toLowerCase().startsWith(prefix.trim().toLowerCase())
        );

        const top10FilteredWords = filteredPredictions
            .slice(0, 10)
            .map((item: { word: string }) => item.word);

        console.log("Filtered top 10:", top10FilteredWords);

        setPrediction(top10FilteredWords);
        setStartAutocomplete(false);
        setIsAutocompleting(true);
    };

    // -- Hook Effects --

    // On component mount, check server status and fetch starting words.
    useEffect(() => {
        checkServerStatus();
        getStartingWords();
    }, []);

    // Trigger server prediction when requested.
    useEffect(() => {
        if (startPrediction) {
            sendTextToServer();
        }
    }, [startPrediction]);

    // Trigger client-side autocomplete or fetch new predictions.
    useEffect(() => {
        if (startAutocomplete && inputText.trim() !== '') {
            const trimmedInput = inputText.trim();
            const words = trimmedInput.split(/\s+/);
            const prefix = words[words.length - 1];

            if (prefix && !inputText.endsWith(" ")) {
                // Wenn es das erste Wort ist, das eingegeben wird
                if (words.length === 1) {
                    // Für das erste Wort immer clientseitige Autovervollständigung verwenden
                    autocomplete(prefix);
                } else {
                    // Wenn der Benutzer ein nachfolgendes Wort eingibt, verwenden wir die clientseitige Autovervollständigung.
                    // Hier wird davon ausgegangen, dass allPredictions bereits die Vorhersagen vom Server enthält,
                    // die nach dem letzten Leerzeichen abgerufen wurden.
                    autocomplete(prefix);
                }
            }
        }
    }, [startAutocomplete, inputText]); // hasFetchedFirstWordPredictions aus den Abhängigkeiten entfernen

    // Wenn der Eingabetext leer wird, lade die Startwörter neu
    useEffect(() => {
        if (inputText.trim() === '') {
            // Lade die Startwörter neu, um sie direkt wieder anzuzeigen
            getStartingWords();
        }
    }, [inputText, getStartingWords]); // getStartingWords zu den Abhängigkeiten hinzufügen

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
                <p>Server is offline 😴 <br /> Error: {serverError}</p>
            )}
        </div>
    );
}

export default FlaskServer;