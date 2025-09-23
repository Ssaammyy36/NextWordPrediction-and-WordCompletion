import React from 'react';
import { usePredictionContext } from '../context/PredictionContext';

function DeleteSentenceButton() {
    // HOL DIR ALLE NÖTIGEN FUNKTIONEN AUS DEM GLOBALEN CONTEXT
    const { setInputText, setPrediction } = usePredictionContext();

    function handleClick() {
        // Setze den inputText auf einen leeren String
        setInputText('');
        // Setze die predictions auf eine leere Liste
        setPrediction([]); 
        console.log('Input field and predictions cleared!');
    }

    return (
        <>
            <button 
                type="button" 
                className="btn btn-outline-success"
                onClick={handleClick}
            >
                <i className="bi bi-arrow-right-circle"></i> Next Sentence 
            </button>
        </>
    );
}

export default DeleteSentenceButton;