import { createSlice,createAsyncThunk  } from '@reduxjs/toolkit';
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


interface MoviesState {
    movieDetail: Movie | null;
    loading: boolean,
    error: string | null , 
  }
  

const initialState: MoviesState = {
    movieDetail: null,
    loading: false,
    error: null
};



export const fetchMovieDetails = createAsyncThunk(
    'movies/fetchMovieDetails',
    async (movieId: number) => {
      const response = await axios.get(`http://localhost:5000/movies/${movieId}`);
      return response.data;
    }
  );

export const addToWatchlist = createAsyncThunk(
    'movies/addToWatchlist',
    async (movie: string) => {
      await axios.post('http://localhost:5000/watchlist', JSON.parse(movie));
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
    },
    extraReducers: (builder) => {
      builder.addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.movieDetail = action.payload;
      });
    },
  });
  
  export const { addToWatchlistStart, addToWatchlistSuccess, addToWatchlistFailure } = watchListSlice.actions;


  
  export default watchListSlice.reducer;