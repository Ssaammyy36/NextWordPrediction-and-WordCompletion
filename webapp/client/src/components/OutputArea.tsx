import React from 'react';
import WordOutputButton from './WordOutputButton';
import { usePredictionContext } from '../context/PredictionContext';

/**
 * Renders the area where word predictions are displayed as clickable buttons.
 * It consumes the global context to get prediction data and to update the input text.
 */
function OutputArea() {
    // Get the necessary state and functions from the global context.
    const {
        setInputText,
        prediction,
        setStartPrediction,
        isAutocompleting,
        setIsAutocompleting
    } = usePredictionContext();

    /**
     * Handles the click event on a prediction button.
     * Its behavior changes based on whether the app is in "autocomplete" mode.
     * @param {string} word The predicted word that was clicked.
     */
    const handleButtonClick = (word) => {
        if (isAutocompleting) {
            setInputText((prevText) => {
                const words = prevText.trim().split(" ");
                words.pop();
                return words.join(" ") + " " + word + " ";
            });
            setIsAutocompleting(false);
            setStartPrediction(true);
        } else {
            setInputText((prevText) => prevText + word + ' ');
            setStartPrediction(true);
        }
    };

    return (
        <div className="mt-10">
            <h3>Word Prediction</h3>
            <div className="d-flex flex-wrap gap-3">
                {prediction && prediction.length > 0 ? (
                    prediction.map((word, index) => (
                        <WordOutputButton
                            key={index}
                            number={index}
                            word={word}
                            onClick={handleButtonClick}
                        />
                    ))
                ) : (
                    <p>No predictions available</p>
                )}
            </div>
        </div>
    );
}

export default OutputArea;
