/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import WatchlistCenter from './WatchListCenter';
import { RootState, AppDispatch } from './store';
import { markAsWatched, fetchMovies } from './features/watchlistSlice';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

test('renders WatchlistCenter component correctly', () => {
  const mockDispatch = jest.fn();
  (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as jest.Mock).mockReturnValue({
    movies: [
      { id: 1, title: 'Movie 1', watched: false },
      { id: 2, title: 'Movie 2', watched: true },
    ],
  });

  const { getByText } = render(<WatchlistCenter />);

  const title1 = getByText('Movie 1');
  const title2 = getByText('Movie 2');
  const watchedText = getByText('Watched');
  const markAsWatchedButton = getByText('Mark as Watched');

  expect(title1).toBeInTheDocument();
  expect(title2).toBeInTheDocument();
  expect(watchedText).toBeInTheDocument();
  expect(markAsWatchedButton).toBeInTheDocument();
});

test('dispatches markAsWatched action on button click', () => {
  const mockDispatch = jest.fn();
  (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as jest.Mock).mockReturnValue({
    movies: [
      { id: 1, title: 'Movie 1', watched: false },
      { id: 2, title: 'Movie 2', watched: false },
    ],
  });

  const { getByText } = render(<WatchlistCenter />);

  const markAsWatchedButton = getByText('Mark as Watched');
  fireEvent.click(markAsWatchedButton);

  expect(mockDispatch).toHaveBeenCalledWith(markAsWatched(1));
});

test('dispatches fetchMovies action on component mount', () => {
  const mockDispatch = jest.fn();
  (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as jest.Mock).mockReturnValue({ movies: [] });

  render(<WatchlistCenter />);

  expect(mockDispatch).toHaveBeenCalledWith(fetchMovies());
});
