import React, { useState } from 'react';
import { pipeline, env } from '@xenova/transformers';

import InputArea from "./components/InputArea";
import OutputArea from "./components/OutputArea";

env.allowLocalModels = false;

function App() {
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
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 p-4">
        <div className="p-10 w-100">
          <div className="mb-4">
            <InputArea inputText={inputText} setInputText={setInputText} /> 
          </div>
          <div>
            <OutputArea setInputText={setInputText} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
