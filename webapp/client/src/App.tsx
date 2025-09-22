import InputArea from "./components/InputArea";
import OutputArea from "./components/OutputArea";
import Header from "./components/Header";
import FlaskServer from './components/FlaskServer';

/**
 * The main App component.
 * It no longer manages state, but simply structures the layout of the application.
 * All state is now handled by the PredictionProvider.
 */
function App() {
  return (
    <>
      <div className="container p-4">
        <section>
          <Header />
        </section>

        <section className="d-flex flex-column gap-3">
          <div>
            {/* All props have been removed, as components now get state from the context. */}
            <InputArea /> 
          </div>
          <div>
            <OutputArea />
          </div>
          <div>
            <FlaskServer />
          </div>
        </section>
      </div>
    </>
  );
}

export default App;