import { useState  } from 'react';

import InputArea from "./components/InputArea";
import OutputArea from "./components/OutputArea";
import AiArea from "./components/AiArea";

function App() {
  const [inputText, setInputText] = useState(''); 
  const [prediction , setPrediction ] = useState(null); 
  const [startPrediction, setStartPrediction] = useState(false);
  const [startAutocomplete, setStartAutocomplete] = useState(false);

  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 p-4">
        <div className="p-10 w-100">
          <div>
            <InputArea 
              inputText={inputText} 
              setInputText={setInputText} 
              setStartPrediction={setStartPrediction}
              setStartAutocomplete={setStartAutocomplete}
            /> 
          </div>
          <div>
            <OutputArea 
              setInputText={setInputText} 
              prediction={prediction} 
              setStartPrediction={setStartPrediction}
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
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
