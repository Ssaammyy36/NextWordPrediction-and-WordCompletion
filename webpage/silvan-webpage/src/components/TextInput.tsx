import React, { useState } from 'react';

function TextInput({ inputText, setInputText, prediction, setStartPrediction, setStartAutocomplete, setIsAutocompleting}) {

    // FAuslösung von Autocomplete bei neuen Buchstaben
    const handleInputChange = (e) => {
        const newInput = e.target.value;
        const lastChar = newInput.slice(-1);

        // Überprüfen, ob der letzte Zeichen ein Buchstabe ist (regex für Buchstaben)
        if (/[a-zA-ZäöüÄÖÜß]/.test(lastChar)) {
            console.log("Buchstabe erkannt:", lastChar);
            setStartAutocomplete(true); 
            setIsAutocompleting(true);
        }

         // Überprüfen, ob der letzte Zeichen eine Zahl von 0 bis 9 ist
        if (/[0-9]/.test(lastChar)) {
            console.log("Zahl erkannt:", lastChar);
            const index = parseInt(lastChar, 10);

            console.log("Prediction-Array:", prediction);
    
            // Überprüfen, ob prediction ein Array ist und der Index gültig ist
            if (Array.isArray(prediction) && prediction.length > 0 && index >= 0 && index < prediction.length) {
                const selectedWord = prediction[index];
                console.log(`Ausgewähltes Wort aufgrund der Zahl: ${selectedWord}`);
                setInputText((prevText) => prevText + selectedWord + ' ');
                setStartPrediction(true);
            } else {
                console.log("Kein gültiges Wort für den eingegebenen Index oder `prediction` ist leer/undefiniert");
            }
        }

        // Aktualisiere den Text-Input-Wert
        setInputText(newInput);
    };

    // Leertaste erkennen -> Vorhersage auslösen
    const handleKeyDown = (e) => {
        if (e.key === ' ' && inputText.trim() !== '') {
            console.log("Leertaste erkannt");
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
