import React, { useState } from 'react';

function TextInput({ inputText, setInputText, setStartPrediction, setStartAutocomplete}) {

    // FAuslösung von Autocomplete bei neuen Buchstaben
    const handleInputChange = (e) => {
        const newInput = e.target.value;
        const lastChar = newInput.slice(-1);

        // Überprüfen, ob der letzte Zeichen ein Buchstabe ist (regex für Buchstaben)
        if (/[a-zA-ZäöüÄÖÜß]/.test(lastChar)) {
            console.log("Buchstabe erkannt:", lastChar);
            setStartAutocomplete(true); 
        }

        // Aktualisiere den Text-Input-Wert
        setInputText(newInput);
    };

    // Leertaste erkennen -> Vorhersage auslösen
    const handleKeyDown = (e) => {
        if (e.key === ' ' && inputText.trim() !== '') {
            console.log("Leertaste erkannt");
            setStartPrediction(true); 
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
