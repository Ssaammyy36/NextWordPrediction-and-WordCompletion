import React, { useState } from 'react';
import { pipeline, env } from '@xenova/transformers';

import TextInput from './TextInput';
import DeleteLastLetterButton from './DeleteLastLetterButton';
import DeleteLastWordButton from './DeleteLastWordButton';
import DeleteSentenceButton from './DeleteSentenceButton';

env.allowLocalModels = false;

function InputArea() {
    const [inputText, setInputText] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false); 

    async function predictNextWord() {
        setLoading(true); 
        try {
            console.log("Test 1");
            const model = await pipeline('fill-mask', 'bert-base-uncased');

            console.log("Test 2");
            const maskedSentence = `${inputText} [MASK]`;

            const results = await model(maskedSentence);

            const newPredictions = results.slice(0, 10).map((result) => ({
                token_str: result.token_str,
                score: result.score,
            }));

            setPredictions(newPredictions);
        } catch (error) {
            console.error("Fehler bei der Vorhersage:", error);
        } finally {
            setLoading(false); // Ladeanzeige deaktivieren
        }
    }

    return (
        <>
            <div className="p-10">
                <h1>Input Text</h1>

                <div>
                    <TextInput inputText={inputText} setInputText={setInputText} />

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
