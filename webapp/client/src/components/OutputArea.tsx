import React from 'react';
import WordOutputButton from './WordOutputButton';

function OutputArea({ setInputText, prediction, setStartPrediction, isAutocompleting, setIsAutocompleting }) {

    // Eingabe ergänzen + neue Vorhersage starten
    const handleButtonClick = (word) => {
        
        if (isAutocompleting) {
          setInputText((prevText) => {
            // Teile den Text in Wörter, entferne das letzte Wort
            const words = prevText.trim().split(" ");
            console.log(words)
            words.pop();
            
            // Füge das neue Wort an der Stelle des gelöschten Wortes hinzu und ergänze ein Leerzeichen
            return words.join(" ") + " " + word + " ";
          });
          console.log("Button geklickt. Starte Autocomplete");
          setIsAutocompleting(false);
          setStartPrediction(true); 
        } else {
          setInputText((prevText) => prevText + word + ' ');
          console.log("Button geklickt. Starte Prediction");
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
              <p>Keine Vorhersage verfügbar</p>
            )}
          </div>
        </div>
    );
}

export default OutputArea;
