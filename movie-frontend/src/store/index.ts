import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../features/moviesSlice';
import watchListReducer from '../features/watchlistSlice';

const store = configureStore({
  reducer: {
    movies: moviesReducer,
    watchList: watchListReducer
  },
});

export type RootState = ReturnType<typeof store.getState>; // Define RootState type
export type AppDispatch = typeof store.dispatch
export default store;
