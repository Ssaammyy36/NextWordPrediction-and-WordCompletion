import React, { useState } from 'react';

function TextInput({ inputText, setInputText, setStartPrediction }) {

    const handleInputChange = (e) => {
        setInputText(e.target.value);
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
