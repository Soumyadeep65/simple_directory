import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../features/moviesSlice';

const store = configureStore({
  reducer: {
    movies: moviesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // Define RootState type
export default store;
