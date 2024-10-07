import React from 'react';

function DeleteSentenceButton({ setInputText }) {
    function handleClick() {
        // Setze den inputText auf einen leeren String
        setInputText('');
        console.log('Input field cleared!');
    }

    return (
        <>
            <button 
                type="button" 
                className="btn btn-outline-success"
                onClick={handleClick}
            >
                <i className="bi bi-arrow-right-circle"></i> Next Sentence 
            </button>
        </>
    );
}

export default DeleteSentenceButton;
