import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/index';

interface MoviesState {
  movies: Movie[];
  filteredMovies: Movie[];
  filters: Filters;
}

interface Movie {
  id: number;
  title: string;
  releaseYear: number;
  original_language: string;
  vote_average: number;
  poster_path:string
}

interface Filters {
  releaseYear: number | null;
  language: string | null;
}

const initialState: MoviesState = {
  movies: [],
  filteredMovies: [],
  filters: {
    releaseYear: null,
    language: null,
  },
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMovies: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
      state.filteredMovies = action.payload;
    },
    setFilter: (state, action: PayloadAction<{ filter: keyof Filters; value: any }>) => {
      const { filter, value } = action.payload;
      state.filters[filter] = value;

      // Apply filters to movies
      state.filteredMovies = state.movies.filter(movie => {
        if (state.filters.releaseYear && movie.releaseYear !== state.filters.releaseYear) {
          return false;
        }
        if (state.filters.language && movie.original_language !== state.filters.language) {
          return false;
        }
        return true;
      });
    },
  },
});

export const { setMovies, setFilter } = moviesSlice.actions;

export default moviesSlice.reducer;
