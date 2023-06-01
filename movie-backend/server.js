import express from 'express';
import axios from 'axios';


const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = '71f6d6491ccd8a70c189ecc6dc85548b';

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// /movies get request to get a paginated, sortable list of movie objects

app.get('/movies', (req, res) => {
  const { cursor = 1, count = 20, sort = 'popularity.desc',query } = req.query;

  const queryParams = {
    api_key: API_KEY,
    page: cursor,
    sort_by: sort,
    include_adult: false,
    include_video: false
  };

  if (query) {
    queryParams.query = query;
  }
  axios
    .get('https://api.themoviedb.org/3/discover/movie', { params: queryParams })
    .then(response => {
      const movies = response.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average
      }));

      res.json(movies);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

//  /movies/:id get request to show the details of the full movie object

app.get('/movies/:id', (req, res) => {
  const movieId = req.params.id;

  axios
    .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: API_KEY
      }
    })
    .then(response => {
      const movie = response.data;
      res.json(movie);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});