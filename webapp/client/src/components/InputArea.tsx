import React, { useState } from 'react';

import TextInput from './TextInput';
import DeleteLastLetterButton from './DeleteLastLetterButton';
import DeleteLastWordButton from './DeleteLastWordButton';
import DeleteSentenceButton from './DeleteSentenceButton';

function InputArea({inputText, prediction, setInputText, setStartPrediction, setStartAutocomplete, setIsAutocompleting, isAutocompleting}) { 
    return (
        <>
            <div className="p-10">
                <h3>Input Text</h3>
                
                <div>
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
                </div>
            </div> 
        </>
    );
}

export default InputArea;
