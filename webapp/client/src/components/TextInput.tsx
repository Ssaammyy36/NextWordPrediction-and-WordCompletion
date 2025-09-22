import React, { useEffect } from 'react';

/**
 * A text input component that provides word predictions and autocomplete functionality.
 * It interacts with a parent component to trigger server predictions and update state.
 */
function TextInput({ 
    inputText, 
    setInputText, 
    prediction, 
    setStartPrediction, 
    setStartAutocomplete, 
    isAutocompleting,
    setIsAutocompleting,
    setPrediction
}) {

    /**
     * Handles changes to the input field by updating the parent state.
     * The core logic is handled in the useEffect hook to react to these changes.
     */
    const handleInputChange = (e) => {
        const newText = e.target.value;
        setInputText(newText);
    };

    /**
     * Handles special key presses like 'Enter'.
     * This is separate from the main input logic to handle specific keyboard interactions.
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log("Enter key detected, clearing input and predictions.");
            e.preventDefault(); // Prevents form submission or other default 'Enter' actions.
            setInputText(''); // Clear the input text.
            setPrediction([]); // Clear the predictions.
            setIsAutocompleting(false); // Ensure autocomplete is off.
        }
    };

    /**
     * This effect hook is the main driver for the component's logic.
     * It runs every time the `inputText` changes, deciding whether to fetch new
     * predictions, trigger autocomplete, or handle user selections.
     */
    useEffect(() => {
        // Don't do anything if the input is empty.
        if (!inputText) {
            setIsAutocompleting(false);
            return;
        }

        const lastChar = inputText.slice(-1);

        // --- 1. Trigger Prediction (on Space) ---
        // When a user finishes a word by typing a space, we need a new set of
        // predictions from the server for the next word.
        if (lastChar === ' ') {
            console.log("Space detected. Starting prediction...");
            setStartPrediction(true);
            setIsAutocompleting(false); // Stop any active autocomplete.
            return;
        }

        // --- 2. Trigger Autocomplete (on Letter) ---
        // If the user is typing a word (i.e., just typed a letter) and we have
        // existing predictions, we can try to autocomplete based on the current word fragment.
        if (/[a-zA-ZäöüÄÖÜß]/.test(lastChar) && prediction && prediction.length > 0) {
            console.log(`Letter "${lastChar}" detected. Starting autocomplete...`);
            setStartAutocomplete(true);
            setIsAutocompleting(true);
            return;
        }
        
        // --- 3. Handle Word Selection (on Number) ---
        // The user can select a predicted word by typing its corresponding number (0-9).
        if (/[0-9]/.test(lastChar)) {
            console.log(`Number "${lastChar}" detected. Selecting word...`);
            const index = parseInt(lastChar, 10);

            // Check if the selected index is valid for the current prediction array.
            if (Array.isArray(prediction) && index >= 0 && index < prediction.length) {
                const selectedWord = prediction[index];
                
                // The current input text includes the number the user just typed.
                // We need to remove that number and the word fragment it was meant to complete,
                // then append the full, selected word and a space.
                const textWithoutNumber = inputText.slice(0, -1);
                const words = textWithoutNumber.split(' ');
                words.pop(); // Remove the incomplete word part.
                words.push(selectedWord); // Add the full selected word.
                
                const updatedText = words.join(' ') + ' ';
                setInputText(updatedText);

                // After selecting a word, immediately trigger a new prediction for the next word.
                setStartPrediction(true);
                setIsAutocompleting(false);
            } else {
                // If the user types a number that doesn't correspond to a prediction,
                // just remove the number from the input to avoid confusion.
                setInputText(inputText.slice(0, -1));
            }
            return;
        }

        // If no other condition is met (e.g., user is deleting characters),
        // ensure we exit autocomplete mode.
        if (isAutocompleting) {
             setIsAutocompleting(false);
        }

    }, [inputText]); // The dependency array ensures this effect runs only when `inputText` changes.

    return (
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Input some text ..."
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}

export default TextInput;