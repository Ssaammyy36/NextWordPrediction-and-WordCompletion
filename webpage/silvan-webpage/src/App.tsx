import { Fragment } from "react/jsx-runtime";

import InputArea from "./components/InputArea";
import OutputArea from "./components/OutputArea";

function App() {
  return (
    <>
      <div className = "p-10">
        <div><InputArea /></div>
        <div><OutputArea /></div>
      </div>
    </>
  );
}

export default App
