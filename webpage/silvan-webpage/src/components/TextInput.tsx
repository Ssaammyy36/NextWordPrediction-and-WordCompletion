import React, { useState } from 'react';

function TextInput({ inputText, setInputText }) {
    // Handler für die Änderung des Input-Felds
    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    return (
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Input some text ..."
                value={inputText} // Verknüpft den State mit dem Input-Feld
                onChange={handleInputChange} // Aktualisiert den State bei Änderungen
            />
        </div>
    );
}

export default TextInput;
