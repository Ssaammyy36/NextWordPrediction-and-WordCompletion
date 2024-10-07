import WordOutputButton from './WordOutputButton';

function OutputArea() {
    return (
        <>
            <div className="p-10">
                <h1>Word Prediction</h1>
                <div className="d-flex flex-wrap gap-3">
                    <WordOutputButton number="0" word="Word ..." />
                    <WordOutputButton number="1" word="Word ..." />
                    <WordOutputButton number="2" word="Word ..." />
                    <WordOutputButton number="3" word="Word ..." />
                    <WordOutputButton number="4" word="Word ..." />
                </div>
                <div className="d-flex flex-wrap gap-3">
                    <WordOutputButton number="5" word="Word ..." />
                    <WordOutputButton number="6" word="Word ..." />
                    <WordOutputButton number="7" word="Word ..." />
                    <WordOutputButton number="8" word="Word ..." />
                    <WordOutputButton number="9" word="Word ..." />
                </div>
            </div>
        </>
    );
}

export default OutputArea;
