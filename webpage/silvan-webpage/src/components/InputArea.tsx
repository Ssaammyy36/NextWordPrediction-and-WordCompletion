import { pipeline } from '@xenova/transformers';

function InputArea() {
    return (
        <>
            <div className="p-10">
                <h1>Input Text</h1>

                <div>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Input some text ..." aria-label="Recipient's username" aria-describedby="basic-addon2" />
                    </div>

                    <div className="d-flex flex-wrap gap-3">
                        <button type="button" className="btn btn-outline-danger">
                            <i className="bi bi-x-circle"></i> Delete Letter 
                        </button>
                        <button type="button" className="btn btn-outline-warning">
                            <i className="bi bi-trash"></i> Delete Word
                        </button>
                        <button type="button" className="btn btn-outline-success">
                            <i className="bi bi-arrow-right-circle"></i> Next Sentence 
                        </button>
                    </div>
                </div>
            </div> 
        </>
    );
}

async function predictNextWord(inputText) {
  // Lade das deutsche BERT-Modell
  const model = await pipeline('fill-mask', 'deepset/gbert-base');

  // Erstelle einen Satz mit einem Platzhalter für das nächste Wort
  const maskedSentence = `${inputText} [MASK]`;

  // Führe die Vorhersage durch
  const results = await model(maskedSentence);

  // Zeige die 10 wahrscheinlichsten Wörter mit ihren Wahrscheinlichkeiten an
  console.log("Vorhersage für das nächste Wort:");
  results.slice(0, 10).forEach((result, index) => {
    console.log(`${index + 1}. ${result.token_str}: ${result.score.toFixed(4)}`);
  });
}

// Beispiel: Rufe die Funktion mit einem unvollständigen Satz auf
const unvollstaendigerSatz = "Heute gehe ich zum";
predictNextWord(unvollstaendigerSatz);


export default InputArea;
