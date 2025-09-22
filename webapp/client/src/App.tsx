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
      <div className="container p-4">
        <section>
          <Header />
        </section>

        <section className="d-flex flex-column gap-3">
          <div>
            <InputArea 
              inputText={inputText} 
              prediction={prediction}
              setInputText={setInputText} 
              setStartPrediction={setStartPrediction}
              setStartAutocomplete={setStartAutocomplete}
              setIsAutocompleting={setIsAutocompleting} 
              isAutocompleting={isAutocompleting}
              setPrediction={setPrediction}
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
          <div >
            {/* <AiArea 
              inputText={inputText} 
              setPrediction={setPrediction}
              startPrediction={startPrediction}
              setStartPrediction={setStartPrediction}
              startAutocomplete={startAutocomplete}
              setStartAutocomplete={setStartAutocomplete}
              setIsAutocompleting={setIsAutocompleting}
            /> */}
          </div>  
          <div >
            <FlaskServer 
              inputText={inputText} 
              startPrediction={startPrediction}
              setStartPrediction={setStartPrediction}
              setPrediction={setPrediction}
              startAutocomplete = {startAutocomplete}
              setStartAutocomplete = {setStartAutocomplete}
              setIsAutocompleting = {setIsAutocompleting}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
