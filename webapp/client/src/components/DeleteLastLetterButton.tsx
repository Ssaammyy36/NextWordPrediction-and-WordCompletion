
interface DeleteLastLetterButtonProps {
    setInputText: (value: React.SetStateAction<string>) => void;
}

function DeleteLastLetterButton({ setInputText }: DeleteLastLetterButtonProps) {
    // Funktion zum Löschen des letzten Zeichens
    function deleteLastLetter() {
        setInputText((prevText: string) => prevText.slice(0, -1)); // Entfernt das letzte Zeichen
    }
    
    function handleClick() {
        deleteLastLetter(); // Aufruf der Löschfunktion
        console.log('Last letter deleted!');
    }

    return (
        <>
            <button 
                type="button" 
                className="btn btn-outline-danger"
                onClick={handleClick}
            >
                <i className="bi bi-x-circle"></i> Delete Letter 
            </button>
        </>
    );
}

export default DeleteLastLetterButton;
