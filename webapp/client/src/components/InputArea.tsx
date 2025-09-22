import React from 'react';
import TextInput from './TextInput';
import DeleteLastLetterButton from './DeleteLastLetterButton';
import DeleteLastWordButton from './DeleteLastWordButton';
import DeleteSentenceButton from './DeleteSentenceButton';
import { usePredictionContext } from '../context/PredictionContext';

/**
 * The InputArea component groups the text input field and action buttons.
 * It no longer manages or passes down state, but its children (like TextInput)
 * will consume the context directly.
 */
function InputArea() { 
    // The delete buttons still need `setInputText`. We can grab it from the context here.
    // A further refactoring could have these buttons use the context directly.
    const { setInputText } = usePredictionContext();

    return (
        <>
            <div className="p-10">
                <h3>Input Text</h3>
                
                <div>
                    {/* TextInput now gets all its data from the context internally. No props needed! */}
                    <TextInput />

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