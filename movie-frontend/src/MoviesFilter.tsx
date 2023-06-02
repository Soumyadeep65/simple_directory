import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from './features/moviesSlice';
import { RootState } from './store/index';

const MoviesFilter: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.movies.filters);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    dispatch(setFilter({ filter: 'releaseYear', value: value ? parseInt(value) : null }));
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    dispatch(setFilter({ filter: 'language', value: value || null }));
  };

  return (
    <div>
      <label htmlFor="year">Release Year:</label>
      <select id="year" value={filters.releaseYear || ''} onChange={handleYearChange}>
        <option value="">All</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        {/* Add more options as needed */}
      </select>

      <label htmlFor="language">Language:</label>
      <select id="language" value={filters.language || ''} onChange={handleLanguageChange}>
        <option value="">All</option>
        <option value="en">English</option>
        <option value="Spanish">Spanish</option>
        <option value="French">French</option>
        <option value="fi">Finnish</option>
        {/* Add more options as needed */}
      </select>
    </div>
  );
};

export default MoviesFilter;
