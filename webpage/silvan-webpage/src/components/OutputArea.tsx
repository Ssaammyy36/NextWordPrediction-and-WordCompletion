import React from 'react';
import WordOutputButton from './WordOutputButton';

function OutputArea({ setInputText }) {
    const handleButtonClick = (word) => {
        // Hier wird der Text an das Eingabefeld angehängt
        setInputText((prevText) => prevText + ' ' + word); // Leerzeichen hinzufügen, falls nötig
    };

    return (
        <div className="p-10">
            <h1>Word Prediction</h1>
            <div className="d-flex flex-wrap gap-3">
                <WordOutputButton number="0" word="Word 1" onClick={handleButtonClick} />
                <WordOutputButton number="1" word="Word 2" onClick={handleButtonClick} />
                <WordOutputButton number="2" word="Word 3" onClick={handleButtonClick} />
                <WordOutputButton number="3" word="Word 4" onClick={handleButtonClick} />
                <WordOutputButton number="4" word="Word 5" onClick={handleButtonClick} />
            </div>
            <div className="d-flex flex-wrap gap-3">
                <WordOutputButton number="5" word="Word 6" onClick={handleButtonClick} />
                <WordOutputButton number="6" word="Word 7" onClick={handleButtonClick} />
                <WordOutputButton number="7" word="Word 8" onClick={handleButtonClick} />
                <WordOutputButton number="8" word="Word 9" onClick={handleButtonClick} />
                <WordOutputButton number="9" word="Word 10" onClick={handleButtonClick} />
            </div>
        </div>
    );
}

export default OutputArea;
