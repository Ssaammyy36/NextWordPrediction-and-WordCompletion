import { useState } from 'react';

import InputArea from "./components/InputArea";
import OutputArea from "./components/OutputArea";
import AiArea from "./components/AiArea";
import Header from "./components/Header";

function App() {
  const [inputText, setInputText] = useState(''); 
  const [prediction, setPrediction] = useState(null); 
  const [startPrediction, setStartPrediction] = useState(false);
  const [startAutocomplete, setStartAutocomplete] = useState(false);
  const [isAutocompleting, setIsAutocompleting] = useState(false);

  return (
    <>
      <div className="container d-flex flex-column min-vh-100 p-4">
        {/* Header ist Teil des Containers */}
        <div className="sticky-top">
          <Header />
        </div>

        {/* Restliche Inhalte */}
        <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
          <div className="p-10 w-100">
            <div>
              
              <InputArea 
                inputText={inputText} 
                prediction={prediction}
                setInputText={setInputText} 
                setStartPrediction={setStartPrediction}
                setStartAutocomplete={setStartAutocomplete}
                setIsAutocompleting={setIsAutocompleting} 
                isAutocompleting={isAutocompleting}
              /> 
            </div>
            <div>
              <OutputArea 
                setInputText={setInputText} 
                prediction={prediction} 
                setStartPrediction={setStartPrediction}
                isAutocompleting={isAutocompleting}
                setIsAutocompleting={setIsAutocompleting}
              />
            </div>
            <div>
              <AiArea 
                inputText={inputText} 
                setPrediction={setPrediction}
                startPrediction={startPrediction}
                setStartPrediction={setStartPrediction}
                startAutocomplete={startAutocomplete}
                setStartAutocomplete={setStartAutocomplete}
                setIsAutocompleting={setIsAutocompleting}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
