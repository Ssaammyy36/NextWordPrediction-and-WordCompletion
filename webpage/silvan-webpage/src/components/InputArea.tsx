import React, { useState } from 'react';

import TextInput from './TextInput';
import DeleteLastLetterButton from './DeleteLastLetterButton';
import DeleteLastWordButton from './DeleteLastWordButton';
import DeleteSentenceButton from './DeleteSentenceButton';

function InputArea({inputText, prediction, setInputText, setStartPrediction, setStartAutocomplete, setIsAutocompleting, isAutocompleting}) { 
    return (
        <>
            <div className="p-10">
                <h1>Input Text</h1>
                <TextInput 
                    inputText={inputText} 
                    prediction={prediction}
                    setInputText={setInputText} 
                    setStartPrediction={setStartPrediction}
                    setStartAutocomplete={setStartAutocomplete}
                    setIsAutocompleting={setIsAutocompleting}
                    isAutocompleting={isAutocompleting}
                />

                <div className="d-flex flex-wrap gap-3">
                    <DeleteLastLetterButton setInputText={setInputText} />
                    <DeleteLastWordButton setInputText={setInputText} />
                    <DeleteSentenceButton setInputText={setInputText} />
                </div>
                {/* <OutputArea setInputText={setInputText} />  setInputText an OutputArea übergeben */}
            </div> 
        </>
    );
}

export default InputArea;
