import { createSlice,createAsyncThunk,PayloadAction   } from '@reduxjs/toolkit';
import axios from 'axios';



interface Movie {
    id: number;
    title: string;
    release_date: string;
    original_language: string;
    homepage: string;
    budget:number;
    overview:string;
    poster_path:string;
}

interface MovieWatched {
    id: number;
    title: string;
    watched: boolean;
  }


interface MoviesState {
    movieDetail: Movie | null;
    loading: boolean,
    error: string | null , 
    movies: MovieWatched[];
  }
  

const initialState: MoviesState = {
    movieDetail: null,
    loading: false,
    error: null,
    movies: [],
};


export const fetchMovieDetails = createAsyncThunk(
    'movies/fetchMovieDetails',
    async (movieId: number) => {
      const response = await axios.get(process.env.REACT_APP_BACKEND_URL+`/movies/${movieId}`);
      return response.data;
    }
  );

export const fetchMovies = createAsyncThunk(
    'movies/fetchMovies',
    async () => {
      const response = await axios.get(process.env.REACT_APP_BACKEND_URL+'/movies/');
      return response.data;
    }
  );

export const addToWatchlist = createAsyncThunk(
    'movies/addToWatchlist',
    async (movie: string) => {
      await axios.post(process.env.REACT_APP_BACKEND_URL+'/watchlist', JSON.parse(movie));
    }
  );

  const watchListSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
      addToWatchlistStart(state) {
        state.loading = true;
        state.error = null;
      },
      addToWatchlistSuccess(state) {
        state.loading = false;
      },
      addToWatchlistFailure(state, action) {
        state.loading = false;
        state.error = action.payload;
      },
      markAsWatched: (state, action: PayloadAction<number>) => {
        const movieId = action.payload;
        const movie = state.movies.find((item) => item.id === movieId);
        if (movie) {
          movie.watched = true;
        }
      },
    },
    extraReducers: (builder) => {
      builder.addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.movieDetail = action.payload;
      });
      builder.addCase(fetchMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
      });
    },
  });


  
  export const { addToWatchlistStart, addToWatchlistSuccess, addToWatchlistFailure,markAsWatched } = watchListSlice.actions;


  
  export default watchListSlice.reducer;