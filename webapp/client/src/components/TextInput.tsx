import React from 'react';

function TextInput({ inputText, setInputText, prediction, setStartPrediction, setStartAutocomplete, setIsAutocompleting }) {
    // Function to handle input changes
    const handleInputChange = (e) => {
        const newInput = e.target.value;
        const lastChar = newInput.slice(-1); // Last character
        console.log("Entered text:", newInput);
    
        if (/[a-zA-ZäöüÄÖÜß]/.test(lastChar) && prediction) {
            console.log(`Letter "${lastChar}" detected. Starting autocomplete`);
            setStartAutocomplete(true);
            setIsAutocompleting(true);
            setInputText(newInput);
        } else if (/[0-9]/.test(lastChar)) {
            console.log("Number detected:", lastChar);
    
            const index = parseInt(lastChar, 10);
            const predictionArray = prediction;
    
            // Validate prediction array
            if (Array.isArray(predictionArray) && index >= 0 && index < predictionArray.length) {
                const selectedWord = predictionArray[index];
                console.log(`Replacing number with word "${selectedWord}"`);
    
                // Replace the number with the selected word
                const updatedText = newInput.replace(/\d+$/, selectedWord) + " ";
                setInputText(updatedText);
    
                // Restart prediction
                setStartPrediction(true);
            } else {
                console.error("Invalid index or prediction array is empty");
            }
        } else if (newInput.trim() !== '' && newInput.endsWith(' ')) {
            console.log("Space detected. Starting prediction");
            setStartPrediction(true);
            setIsAutocompleting(false);
            setInputText(newInput);
        } else {
            setInputText(newInput);
        }
    };
    // Function to handle key presses (Smartphone-Tastatur)
    const handleKeyDown = (e) => {

        // Leertaste erkannt 
        if (e.key === ' ' && inputText.trim() !== '') {
            console.log("Space detected. Starting prediction");
            setStartPrediction(true);
            setIsAutocompleting(false);
        } 
        
        // Enter erkannt
        else if (e.key === 'Enter') {
            console.log("Enter key detected");
            setInputText('');
        } 
        
        // Tab erkannt
        else if (e.key === 'Tab') {
            console.log("Tab key detected. Lösche letztes Wort");
            e.preventDefault(); // Prevent default tab behavior

            setInputText((prevText) => {
                // Teile den Text in Wörter, entferne das letzte Wort und lasse ein Leerzeichen am Ende
                const words = prevText.trim().split(' ');
                words.pop(); // Löscht das letzte Wort
                return words.join(' ') + ' '; // Die restlichen Wörter wieder zusammensetzen und ein Leerzeichen hinzufügen
            });
            setStartPrediction(true);
        }
    };


    return (
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Input some text ..."
                value={inputText} // Bind the state to the input field
                onChange={handleInputChange} // Update state on input changes
                onKeyDown={handleKeyDown} // Handle key presses
                //onInput={handleOnInput}
            />
        </div>
    );
}

export default TextInput;
