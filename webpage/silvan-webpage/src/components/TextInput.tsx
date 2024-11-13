import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';


function TextInput({ inputText, setInputText, prediction, setStartPrediction, setStartAutocomplete, setIsAutocompleting}) {

    // Auslösung von Autocomplete bei neuen Buchstaben
    const handleInputChange = (e) => {
        const newInput = e.target.value;
        const lastChar = newInput.slice(-1); // Letztes Zeichen
        console.log("Eingegebener Text:", newInput);
    
        // Überprüfen, ob der letzte Zeichen ein Buchstabe ist
        if (/[a-zA-ZäöüÄÖÜß]/.test(lastChar)) {
            console.log(`Buchstabe "${lastChar}" erkannt. Starte Autocomplete`);

            setStartAutocomplete(true); 
            setIsAutocompleting(true);
            setInputText(newInput); // Den neuen Text setzen
        }
        // Überprüfen, ob der letzte Zeichen eine Zahl ist
        else if (/[0-9]/.test(lastChar)) {
            console.log("Zahl erkannt:", lastChar);
            const index = parseInt(lastChar, 10);
            const predictionArray = prediction;
    
            // Überprüfen, ob `predictionArray` ein Array ist und der Index gültig ist
            if (Array.isArray(predictionArray) && predictionArray.length > 0 && index >= 0 && index < predictionArray.length) {
                const selectedWord = predictionArray[index];
                console.log(`Für Index ${index} Wort ${selectedWord} einsetzen`);
    
                // Zahl durch Wort ersetzen
                const words = newInput.trim().split(" ");
                words.pop();                                   
                words.push(selectedWord);
                setInputText(words.join(" ") + " ");

                 // Vorhersage erneut starten
                setStartPrediction(true); 
            } else {
                console.log("Kein gültiges Wort für den eingegebenen Index oder `predictionArray` ist leer/undefiniert");
            }
        } 
        // Wenn es keine Zahl oder Buchstabe ist, setze den neuen Input-Wert
        else {
            setInputText(newInput);
        }
    };
    
    // Leertaste erkennen und Vorhersage starten
    const handleKeyDown = (e) => {
        if (e.key === ' ' && inputText.trim() !== '') {
            console.log("Leertaste erkannt. Vorhersage starten");

            setStartPrediction(true); 
            setIsAutocompleting(false);
        }
    };

    return (
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Input some text ..."
                value={inputText} // Verknüpft den State mit dem Input-Feld
                onChange={handleInputChange} // Aktualisiert den State bei Änderungen
                onKeyDown={handleKeyDown} // Event für Tastenanschläge
            />
        </div>
    );
}

export default TextInput;
