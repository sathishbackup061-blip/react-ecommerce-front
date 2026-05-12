import React from "react";

const LocalSearch = ({keyword,setKeyword}) => {

    // search step 3 
    const handleSearchChange = (e) => {
        e.preventDefault();
        setKeyword(e.target.value.toLowerCase());
    };

    return(
        <div className="pt-2">
              {/* search step 2 */}
                <input 
                    type="search"
                    placeholder="Filter"
                    value={keyword}
                    onChange={handleSearchChange} 
                    className="form-control mb-4"
                    
                />
        </div>
    )
}

export default LocalSearch;