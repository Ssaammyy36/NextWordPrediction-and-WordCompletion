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
                        <button type="button" className="btn btn-success">Next</button>
                        <button type="button" className="btn btn-warning">Delete word </button>
                        <button type="button" className="btn btn-danger">Delete Sentence</button>
                    </div>
                </div>
            </div> 
        </>
    );
}

export default InputArea;