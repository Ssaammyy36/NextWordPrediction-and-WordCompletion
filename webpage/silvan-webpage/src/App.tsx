import InputArea from "./components/InputArea";
import OutputArea from "./components/OutputArea";

function App() {
  return (
    <>
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 p-4">
      <div className="p-10 w-100">
        <div className="mb-4">
          <InputArea />
        </div>
        <div>
          <OutputArea />
        </div>
      </div>
    </div>
  </>
  );
}

export default App
