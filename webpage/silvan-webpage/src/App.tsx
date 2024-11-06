import React, { useState, useEffect  } from 'react';

import InputArea from "./components/InputArea";
import OutputArea from "./components/OutputArea";
import AiArea from "./components/AiArea";

function App() {
  const [inputText, setInputText] = useState(''); 

  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 p-4">
        <div className="p-10 w-100">
          <div>
            <InputArea inputText={inputText} setInputText={setInputText} /> 
          </div>
          <div>
            <OutputArea setInputText={setInputText} />
          </div>
          <div>
            <AiArea />
            {/*<TrainAiModel />*/}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
