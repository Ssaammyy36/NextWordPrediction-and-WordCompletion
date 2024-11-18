import { useState } from 'react';

import InputArea from "./components/InputArea";
import OutputArea from "./components/OutputArea";
import AiArea from "./components/AiArea";
import Header from "./components/Header";
import FlaskServer from './components/FlaskServer';

function App() {
  const [inputText, setInputText] = useState(''); 
  const [prediction, setPrediction] = useState(null); 
  const [startPrediction, setStartPrediction] = useState(false);
  const [startAutocomplete, setStartAutocomplete] = useState(false);
  const [isAutocompleting, setIsAutocompleting] = useState(false);

  return (
    <>
      <div className="container d-flex flex-column min-vh-100 p-4">
        <div>
          <Header />
        </div>

        {/* Restliche Inhalte */}
        <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
          <div className="w-100 m-8"> {/* Abstand nach unten */}
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
          <div className="w-100 m-8"> {/* Abstand nach unten */}
            <OutputArea 
              setInputText={setInputText} 
              prediction={prediction} 
              setStartPrediction={setStartPrediction}
              isAutocompleting={isAutocompleting}
              setIsAutocompleting={setIsAutocompleting}
            />
          </div>
          <div className="w-100 m-8"> {/* Abstand nach unten */}
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
          <div className="w-100 m-8">
            <FlaskServer />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
