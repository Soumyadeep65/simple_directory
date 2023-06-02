import React,{useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsWatched,fetchMovies } from './features/watchlistSlice';
import { RootState,AppDispatch  } from './store';
import './WatchListCenter.css';

const WatchlistCenter: React.FC = () => {
  const movies = useSelector((state: RootState) => state.watchList.movies);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleMarkAsWatched = (movieId: number) => {
    dispatch(markAsWatched(movieId));
  };

  return (
    <div className="watchlist-center">
      <h1 className="watchlist-center__title">Watchlist Center</h1>
      <div className="watchlist-center__movies">
      {movies.map((movie) => (
        <div key={movie.id} className="watchlist-center__movie">
          <h2 className="watchlist-center__movie-title">{movie.title}</h2>
          {movie.watched ? (
            <p>Watched</p>
          ) : (
            <button className="watchlist-center__mark-watched" onClick={() => handleMarkAsWatched(movie.id)}>Mark as Watched</button>
          )}
        </div>
      ))}
      </div>
    </div>
  );
};

export default WatchlistCenter;
