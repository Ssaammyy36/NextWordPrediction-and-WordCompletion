function WordOutputButton({ number, word }) {
    function handleClick() {
        console.log('clicked!');
    }

    return (
        <button 
            type="button" 
            className="btn btn-outline-primary mb-3"
            onClick={handleClick}
        >
            <i className={`bi bi-${number}-circle`}></i> {word}
        </button>
    );
}

export default WordOutputButton;

