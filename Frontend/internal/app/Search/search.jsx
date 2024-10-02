"use client";
import { MdSearch } from 'react-icons/md';
import styles from './search.module.css';
import { useState } from 'react';

const Search = ({ placeholder, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);  // Call the passed in callback function with the search term
  };

  return (
    <div className={styles.container}>
      <MdSearch  className={styles.icon}/>
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default Search;

