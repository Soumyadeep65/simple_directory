import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState,AppDispatch  } from './store';
import { fetchMovieDetails, addToWatchlist } from './features/watchlistSlice';
import { useParams } from 'react-router-dom';
import './MovieDetailsPage.css';

interface MovieDetailsPageProps {
  movieId: string;
}

const MovieDetailsPage: React.FC<MovieDetailsPageProps> = () => {
  const { movieId } = useParams();  
  const parsedMovieId = parseInt(movieId || '', 10);
  const dispatch = useDispatch<AppDispatch>();
  const { movieDetail, loading, error } = useSelector((state: RootState) => state.watchList);

  useEffect(() => {
    dispatch(fetchMovieDetails(parsedMovieId));
  }, [dispatch, parsedMovieId]);

  const handleAddToWatchlist = () => {
    if (movieDetail) {
      let DbMovieDetailAdd = {movieId:movieId,title:movieDetail.title,posterPath:movieDetail.poster_path,releaseDate:movieDetail.release_date}
      dispatch(addToWatchlist(JSON.stringify(DbMovieDetailAdd)));
      alert("Successfully added to watchlist")
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {movieDetail && (
        <div className="movie-details"  >
          <h2 className="title">Movie Details</h2>
          <p>Movie ID: {movieId}</p>
          <h2 className="title">{movieDetail.title}</h2>
          <p className="release-year">Release Year: {movieDetail.release_date}</p>
          <p className="language">Language: {movieDetail.original_language}</p>
          <p>{movieDetail.homepage}</p>
          <p className="budget">{movieDetail.budget}</p>
          <p className="overview">{movieDetail.overview}</p>
          <button className="add-to-watchlist" onClick={handleAddToWatchlist}>Add to Watchlist</button>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;
