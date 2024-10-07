import React, { useState } from 'react';

import InputArea from "./components/InputArea";
import OutputArea from "./components/OutputArea";

function App() {
  const [inputText, setInputText] = useState(''); 

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
