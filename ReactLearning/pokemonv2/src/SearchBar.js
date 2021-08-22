import React from 'react'

const SearchBar = ({ filterText, onFilterTextChange }) => {

    let timeoutId;
    const handleFilterTextChange = e => {
        if(timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            onFilterTextChange(e.target.value);
        }, 1000);
    }

    return (
        <form>
            <input 
                type="text" 
                placeholder="Search..." 
                onChange={handleFilterTextChange}
            />
        </form>
    );
}

export default SearchBar
