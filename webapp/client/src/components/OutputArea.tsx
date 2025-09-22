import React from 'react';
import WordOutputButton from './WordOutputButton';

/**
 * Renders the area where word predictions are displayed as clickable buttons.
 * When a button is clicked, it updates the input text in the parent component
 * and triggers a new prediction request.
 */
function OutputArea({ 
  setInputText, 
  prediction, 
  setStartPrediction, 
  isAutocompleting, 
  setIsAutocompleting 
}) {

    /**
     * Handles the click event on a prediction button.
     * Its behavior changes based on whether the app is in "autocomplete" mode.
     * @param {string} word The predicted word that was clicked.
     */
    const handleButtonClick = (word) => {
        
        // If we are in autocomplete mode, the goal is to replace the currently typed,
        // incomplete word with the selected prediction.
        if (isAutocompleting) {
          setInputText((prevText) => {
            // Split the text into words to easily manipulate the last one.
            const words = prevText.trim().split(" ");
            // Remove the last, incomplete word.
            words.pop();
            
            // Rebuild the string with the completed word and add a space to be ready for the next word.
            // The extra space at the start handles cases where there's only one word.
            return words.join(" ") + " " + word + " ";
          });
          
          setIsAutocompleting(false); // Exit autocomplete mode after selection.
          setStartPrediction(true);   // Request a new prediction for the next word.

        } else {
          // If not in autocomplete mode, simply append the selected word and a space.
          // This is for when the user clicks a prediction for the very next word.
          setInputText((prevText) => prevText + word + ' ');
          setStartPrediction(true); // Request a new prediction.
        }
    };

    return (
        <div className="mt-10">
          <h3>Word Prediction</h3>
          
          <div className="d-flex flex-wrap gap-3"> 
            {/* Conditionally render the prediction buttons. */}
            {/* Check if the prediction array exists and is not empty. */}
            {prediction && prediction.length > 0 ? (
              // If predictions are available, map over them and render a button for each.
              prediction.map((word, index) => (
                <WordOutputButton 
                  key={index} 
                  number={index} 
                  word={word} 
                  onClick={handleButtonClick} 
                />
              ))
            ) : (
              // If no predictions are available, show a placeholder message.
              <p>No predictions available</p>
            )}
          </div>
        </div>
    );
}

export default OutputArea;