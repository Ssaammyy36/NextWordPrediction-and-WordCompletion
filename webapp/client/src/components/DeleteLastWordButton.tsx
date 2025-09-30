interface DeleteLastWordButtonProps {
    setInputText: (value: React.SetStateAction<string>) => void;
}

function DeleteLastWordButton({ setInputText }: DeleteLastWordButtonProps) {
    // Funktion zum Löschen des letzten Wortes
    function deleteLastWord() {
        setInputText((prevText: string) => {
            // Teile den Text in Wörter, entferne das letzte Wort und verbinde die restlichen Wörter
            return prevText.trim().split(' ').slice(0, -1).join(' ');
        });
    }

    function handleClick() {
        deleteLastWord();
        console.log('Last word deleted!');
    }

    return (
        <>
            <button 
                type="button" 
                className="btn btn-outline-warning"
                onClick={handleClick}
            >
                <i className="bi bi-trash"></i> Delete Word
            </button>
        </>
    );
}

export default DeleteLastWordButton;
