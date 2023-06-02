import React, { useEffect }  from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import { setMovies } from './features/moviesSlice';
import { useDispatch, useSelector } from 'react-redux';
import MoviesFilter from './MoviesFilter';
import { RootState } from './store/index';
import axios from 'axios';


const App: React.FC = () => {
  const dispatch = useDispatch();
  const filteredMovies = useSelector((state: RootState) => state.movies.filteredMovies);

  useEffect(() => {
    // Fetch movies from API and dispatch setMovies action
    const fetchMovies = async () => {
      // Replace with your API call to fetch movies
      try {
        const response = await axios.get('http://localhost:5000/movies');
        console.log(response)
        dispatch(setMovies(response.data));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [dispatch]);

  return (
    <div>
    <h1>Movies</h1>
    <MoviesFilter />
    <ul>
      {filteredMovies.map((movie: { id: React.Key | null | undefined; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  </div>
  );
};

ReactDOM.render( <Provider store={store}><App /></Provider>, document.getElementById('root'));