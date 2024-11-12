import React from 'react';
import WordOutputButton from './WordOutputButton';

function OutputArea({ setInputText, prediction, setStartPrediction }) {

    // Eingabe ergänzen + neue Vorhersage starten
    const handleButtonClick = (word) => {
        setInputText((prevText) => prevText + word + ' ');
        console.log("Button geklickt.");
        setStartPrediction(true); 
    };

    return (
        <div className="p-10">
          <h1>Word Prediction</h1>
          <div className="d-flex flex-wrap gap-3 justify-content-start"> {/* Flexbox-Container */}
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
              <p>Keine Vorhersage verfügbar</p>
            )}
          </div>
        </div>
    );
}

export default OutputArea;
