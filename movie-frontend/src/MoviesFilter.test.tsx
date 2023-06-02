/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import MoviesFilter from './MoviesFilter';
import { setFilter } from './features/moviesSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

test('renders MoviesFilter component correctly', () => {
  const mockDispatch = jest.fn();

  (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as jest.Mock).mockReturnValue({
    releaseYear: 2021,
    language: 'en',
  });

  const { getByLabelText } = render(<MoviesFilter />);

  const yearSelect = getByLabelText('Release Year:') as HTMLSelectElement;
  const languageSelect = getByLabelText('Language:') as HTMLSelectElement;

  expect(yearSelect.value).toBe('2021');
  expect(languageSelect.value).toBe('en');
});

test('dispatches setFilter action on year select change', () => {
  const mockDispatch = jest.fn();
  
  (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as jest.Mock).mockReturnValue({
    releaseYear: null,
    language: 'en',
  });

  const { getByLabelText } = render(<MoviesFilter />);

  const yearSelect = getByLabelText('Release Year:') as HTMLSelectElement;
  fireEvent.change(yearSelect, { target: { value: '2022' } });

  expect(mockDispatch).toHaveBeenCalledWith(setFilter({ filter: 'releaseYear', value: 2022 }));
});

test('dispatches setFilter action on language select change', () => {
  const mockDispatch = jest.fn();
 
  (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as jest.Mock).mockReturnValue({
    releaseYear: 2021,
    language: null,
  });

  const { getByLabelText } = render(<MoviesFilter />);

  const languageSelect = getByLabelText('Language:') as HTMLSelectElement;
  fireEvent.change(languageSelect, { target: { value: 'fi' } });

  expect(mockDispatch).toHaveBeenCalledWith(setFilter({ filter: 'language', value: 'fi' }));
});
