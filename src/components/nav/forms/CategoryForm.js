import React from "react";
import Button from 'react-bootstrap/Button';

   const categoryForm = ({handleSubmit, name, setName}) => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter category name" 
                    required
                />
            </div>
            <br />
            <Button variant="outline-primary" type="submit">
                Save
            </Button>
        </form>
    );

    export default categoryForm;