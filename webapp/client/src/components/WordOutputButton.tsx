function WordOutputButton({ number, word, onClick }) {
    return (
        <>
            <button 
                type="button" 
                className="btn btn-outline-primary"
                onClick={() => onClick(word)} // Hier wird die onClick-Prop aufgerufen
            >
                <i className={`bi bi-${number}-circle`}></i> {word}
            </button>
        </>
    );
}

export default WordOutputButton;