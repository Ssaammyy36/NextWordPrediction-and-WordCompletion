import React, { useEffect } from 'react';
import { usePredictionContext } from '../context/PredictionContext';

/**
 * A text input component that provides word predictions and autocomplete functionality.
 * It consumes the global PredictionContext to get and set all necessary state.
 */
function TextInput() {
    // Destructure all the state and functions needed from the global context.
    const {
        inputText,
        setInputText,
        prediction,
        setPrediction,
        setStartPrediction,
        setStartAutocomplete,
        isAutocompleting,
        setIsAutocompleting
    } = usePredictionContext();

    /**
     * Handles changes to the input field by updating the global state.
     */
    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    /**
     * Handles the Enter key press to clear the input and predictions.
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log("Enter key detected, clearing input and predictions.");
            e.preventDefault();
            setInputText('');
            setPrediction([]); // Clear predictions from context.
            setIsAutocompleting(false);
        }
    };

    /**
     * This effect hook is the main driver for the component's logic.
     * It runs every time the `inputText` changes.
     */
    useEffect(() => {
        if (!inputText) {
            setIsAutocompleting(false);
            return;
        }

        const lastChar = inputText.slice(-1);

        // --- 1. Trigger Prediction (on Space) ---
        if (lastChar === ' ') {
            console.log("Space detected. Starting prediction.");
            setStartPrediction(true);
            setIsAutocompleting(false);
            return;
        }

        // --- 2. Trigger Autocomplete (on Letter) ---
        if (/[a-zA-ZäöüÄÖÜß]/.test(lastChar) && prediction && prediction.length > 0) {
            console.log(`Letter "${lastChar}" detected. Starting autocomplete.`);
            setStartAutocomplete(true);
            setIsAutocompleting(true);
            return;
        }
        
        // --- 3. Handle Word Selection (on Number) ---
        if (/[0-9]/.test(lastChar)) {
            console.log(`Number "${lastChar}" detected. Selecting word...`);
            const index = parseInt(lastChar, 10);

            if (Array.isArray(prediction) && index >= 0 && index < prediction.length) {
                const selectedWord = prediction[index];
                
                const textWithoutNumber = inputText.slice(0, -1);
                const words = textWithoutNumber.split(' ');
                words.pop();
                words.push(selectedWord);
                
                const updatedText = words.join(' ') + ' ';
                setInputText(updatedText);

                setStartPrediction(true);
                setIsAutocompleting(false);
            } else {
                setInputText(inputText.slice(0, -1));
            }
            return;
        }

        if (isAutocompleting) {
             setIsAutocompleting(false);
        }

    }, [inputText, setInputText, setPrediction, setStartPrediction, setStartAutocomplete, setIsAutocompleting]); // IMPORTANT: `prediction` is intentionally excluded to prevent an infinite loop.

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
