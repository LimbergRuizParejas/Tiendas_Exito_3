import React from 'react';

const SearchBar = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="search-bar"
  />
);

export default SearchBar;
