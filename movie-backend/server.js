import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';


const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = '71f6d6491ccd8a70c189ecc6dc85548b';
const CACHE_DURATION = 60; // Cache duration in seconds
const cache = {}; // In-memory cache

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/watchlist');

// Define Movie Schema
const movieSchema = new mongoose.Schema({
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  posterPath: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create Movie model
const Movie = mongoose.model('Movie', movieSchema);



app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// /movies get request to get a paginated, sortable list of movie objects

app.get('/movies', (req, res) => {
  let { cursor = 1, count = 20, sort = 'popularity.desc',query } = req.query;

   // Validate and sanitize input
   cursor = parseInt(cursor);
   count = parseInt(count);

   // Generate a cache key based on the query parameters
   const cacheKey = `${cursor}_${count}_${sort}_${query}`;



   // Adjust cursor and count to retrieve the desired subset
   const startIndex = (cursor - 1) * count;
   const endIndex = cursor * count;

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

  if (cache[cacheKey] && cache[cacheKey].expiry > Date.now()) {
    const cachedData = cache[cacheKey].data;
    res.json(cachedData);
  }
  else{
  axios
    .get('https://api.themoviedb.org/3/discover/movie', { params: queryParams })
    .then(response => {
      const movies = response.data.results.slice(startIndex, endIndex).map(movie => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average
      }));

      // Save the data to the cache
      cache[cacheKey] = {
        data: movies,
        expiry: Date.now() + CACHE_DURATION * 1000,
      };

      res.json(movies);
    
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  }
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

// Watchlist CRUD - Store the movies added to watchlist into MongoDB

// GET /watchlist
app.get('/watchlist', (req, res) => {
  Movie.find()
    .sort({ createdAt: -1 })
    .exec((err, movies) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(movies);
    });
});

// POST /watchlist
app.post('/watchlist', (req, res) => {
  const { movieId, title, posterPath, releaseDate } = req.body;

  const movie = new Movie({
    movieId,
    title,
    posterPath,
    releaseDate,
  });

  movie.save((err, savedMovie) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(savedMovie);
  });
});

// PUT /watchlist/:id
app.put('/watchlist/:id', (req, res) => {
  const movieId = req.params.id;
  const { title, posterPath, releaseDate } = req.body;

  Movie.findOneAndUpdate(
    { movieId },
    { title, posterPath, releaseDate, updatedAt: Date.now() },
    { new: true },
    (err, updatedMovie) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (!updatedMovie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(updatedMovie);
    }
  );
});

// DELETE /watchlist/:id
app.delete('/watchlist/:id', (req, res) => {
  const movieId = req.params.id;

  Movie.findOneAndDelete({ movieId }, (err, deletedMovie) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});