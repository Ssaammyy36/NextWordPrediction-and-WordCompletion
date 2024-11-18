import React from 'react';

function TextInput({ inputText, setInputText, prediction, setStartPrediction, setStartAutocomplete, setIsAutocompleting }) {
    // Function to handle input changes
    const handleInputChange = (e) => {
        const newInput = e.target.value;
        const lastChar = newInput.slice(-1); // Last character
        console.log("Entered text:", newInput);

        // Buchstabe erkannt 
        if (/[a-zA-ZäöüÄÖÜß]/.test(lastChar) && prediction) {
            console.log(`Letter "${lastChar}" detected. Starting autocomplete`);

            setStartAutocomplete(true);
            setIsAutocompleting(true);
            setInputText(newInput); // Set new text
        }

        // Nummer erkannt
        else if (/[0-9]/.test(lastChar)) {
            console.log("Number detected:", lastChar);
            const index = parseInt(lastChar, 10);
            const predictionArray = prediction;

            // Ensure `predictionArray` is an array and the index is valid
            if (Array.isArray(predictionArray) && predictionArray.length > 0 && index >= 0 && index < predictionArray.length) {
                const selectedWord = predictionArray[index];
                console.log(`For index ${index}, replacing with word "${selectedWord}"`);

                // Replace the number with the predicted word
                const words = newInput.trim().split(" ");
                words.pop();
                words.push(selectedWord);
                setInputText(words.join(" ") + " ");

                // Restart prediction
                setStartPrediction(true);
            } else {
                console.log("Invalid index or `predictionArray` is empty/undefined");
            }
        } else {
            setInputText(newInput);
        }
    };

    // Function to handle key presses
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
            />
        </div>
    );
}

export default TextInput;
