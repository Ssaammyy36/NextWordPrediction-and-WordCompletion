import React, { useState, useEffect } from "react";
import { usePredictionContext } from "../context/PredictionContext";

// Server Configuration
const SERVER_URL = "http://192.168.0.42:5000/"; // Use the network IP for mobile testing
const PREDICT_URL = SERVER_URL + "predict";
const CHECK_STATUS_URL = SERVER_URL + "checkStatus";

/**
 * This component acts as a bridge to the Python/Flask backend.
 * It handles API calls for predictions and server status checks, using state from the global context.
 */
function FlaskServer() {
    // Get all necessary state and functions from the global PredictionContext.
    const {
        inputText,
        startPrediction,
        setStartPrediction,
        setPrediction,
        startAutocomplete,
        setStartAutocomplete,
        setIsAutocompleting
    } = usePredictionContext();

    // Local state for this component to manage its own UI (status, errors, etc.).
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
            console.log("Server response:", data);

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
                setIsServerOnline(statusText === "Online");
            } else {
                setIsServerOnline(false);
            }
        } catch (error: any) {
            console.error("Server is not reachable:", error);
            setIsServerOnline(false);
            setServerError(error.message || "Server is offline.");
        }
    };

    /**
     * Filters predictions on the client-side for fast autocomplete.
     */
    const autocomplete = (prefix: string) => {
        if (!Array.isArray(allPredictions) || allPredictions.length === 0 || !prefix) {
            setPrediction([]);
            return;
        }

        console.log("Autocomplete prefix:", prefix);

        const filteredWords = allPredictions
            .filter((item: { word: string }) =>
                item.word.trim().toLowerCase().startsWith(prefix.trim().toLowerCase())
            )
            .map((item: { word: string }) => item.word);

        const top10FilteredWords = filteredWords.slice(0, 10);
        console.log("Filtered top 10:", top10FilteredWords);

        setPrediction(top10FilteredWords);
        setStartAutocomplete(false);
        setIsAutocompleting(true);
    };

    // Check server status on component mount.
    useEffect(() => {
        checkServerStatus();
    }, []);

    // Trigger server prediction when requested.
    useEffect(() => {
        if (startPrediction) {
            sendTextToServer();
        }
    }, [startPrediction]);

    // Trigger client-side autocomplete when requested.
    useEffect(() => {
        if (startAutocomplete && inputText.trim() !== '') {
            const words = inputText.trim().split(/\s+/);
            const prefix = words[words.length - 1];

            if (prefix && !inputText.endsWith(" ")) {
                autocomplete(prefix);
            }
        }
    }, [startAutocomplete, inputText]);

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
