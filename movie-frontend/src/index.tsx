import React, { useEffect,useRef  }  from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import { setMovies } from './features/moviesSlice';
import { useDispatch, useSelector } from 'react-redux';
import MoviesFilter from './MoviesFilter';
import { RootState } from './store/index';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './index.css'
import { Link } from 'react-router-dom';
import MovieDetailsPage from './MovieDetailsPage';


const App: React.FC = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state: RootState) => state.movies.movies);
  const page = useRef(1);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/movies', {
          params: {
            sort: 'vote_average.desc', // Sort by top-rated movie first
            cursor: page.current,
            count: 10, // Number of movies per page
          },
        });
        dispatch(setMovies(response.data));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [dispatch]);

  const loadMoreMovies = async () => {
    page.current += 1;
    try {
      const response = await axios.get('http://localhost:5000/movies', {
        params: {
          sort: 'vote_average.desc',
          cursor: page.current,
          count: 10,
        },
      });
      dispatch(setMovies([...movies, ...response.data]));
    } catch (error) {
      console.error('Error loading more movies:', error);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMoreMovies();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies]);

  return (
    <div>
      <h1>Movies</h1>
      <MoviesFilter />
      <div className="container">
        {movies.map((movie) => (
          <div key={movie.id} className="movie">
            <img src={"https://image.tmdb.org/t/p/w1280"+movie.poster_path} alt={movie.title} />
            <h3 className="title">{movie.title}</h3>
            <p className="release-year">Release Year: {movie.releaseYear}</p>
            <p className="language">Language: {movie.original_language}</p>
            <p className="vote">Movie Ratings: {movie.vote_average}</p>
            <Link to={`/movies/${movie.id}`} >View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

ReactDOM.render( 
<Provider store={store}>
<Router>
      <Routes>
        <Route path="/" Component={App} />
        <Route path="/movies/:movieId" element={<MovieDetailsPage movieId={''} />} />
      </Routes>
  </Router>
</Provider>, 

document.getElementById('root'));