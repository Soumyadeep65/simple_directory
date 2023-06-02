/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist } from './features/watchlistSlice';
import { useParams } from 'react-router-dom';
import MovieDetailsPage from './MovieDetailsPage';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

test('renders MovieDetailsPage component correctly', () => {
  const mockDispatch = jest.fn();
  const mockUseParams = jest.fn().mockReturnValue({ movieId: '123' });
  const mockSelector = jest.fn().mockReturnValue({
    movieDetail: {
      title: 'Test Movie',
      release_date: '2023-01-01',
      original_language: 'English',
      homepage: 'https://example.com',
      budget: 1000000,
      overview: 'Test overview',
    },
    loading: false,
    error: null,
  });

  (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as jest.Mock).mockImplementation(mockSelector);
  (useParams as jest.Mock).mockImplementation(mockUseParams);

  const { getByText } = render(<MovieDetailsPage movieId={''} />);

  const movieTitle = getByText('Test Movie');
  const releaseYear = getByText('Release Year: 2023-01-01');
  const language = getByText('Language: English');
  const homepage = getByText('https://example.com');
  const budget = getByText('1000000');
  const overview = getByText('Test overview');
  const addToWatchlistButton = getByText('Add to Watchlist');

  expect(movieTitle).toBeInTheDocument();
  expect(releaseYear).toBeInTheDocument();
  expect(language).toBeInTheDocument();
  expect(homepage).toBeInTheDocument();
  expect(budget).toBeInTheDocument();
  expect(overview).toBeInTheDocument();
  expect(addToWatchlistButton).toBeInTheDocument();
});

test('dispatches addToWatchlist action on button click', () => {
  const mockDispatch = jest.fn();
  const mockUseParams = jest.fn().mockReturnValue({ movieId: '123' });
  const mockSelector = jest.fn().mockReturnValue({
    movieDetail: {
      title: 'Test Movie',
      poster_path: '/test-poster.jpg',
      release_date: '2023-01-01',
      original_language: 'English',
    },
    loading: false,
    error: null,
  });

  (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  (useSelector as jest.Mock).mockImplementation(mockSelector);
  (useParams as jest.Mock).mockImplementation(mockUseParams);

  const { getByText } = render(<MovieDetailsPage movieId={''} />);

  const addToWatchlistButton = getByText('Add to Watchlist');
  fireEvent.click(addToWatchlistButton);

  expect(mockDispatch).toHaveBeenCalledWith(
    addToWatchlist(
      JSON.stringify({
        movieId: '123',
        title: 'Test Movie',
        posterPath: '/test-poster.jpg',
        releaseDate: '2023-01-01',
      })
    )
  );
});
