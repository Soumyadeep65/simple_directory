/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-import-module-exports */
import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = '71f6d6491ccd8a70c189ecc6dc85548b';
const CACHE_DURATION = 60; // Cache duration in seconds
const cache = {}; // In-memory cache

const options = {
  key: fs.readFileSync('/home/ubuntu/simple_directory/movie-backend/config/cert.key'),
  cert: fs.readFileSync('/home/ubuntu/simple_directory/movie-backend/config/cert.crt')
};

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1000, // Maximum 1000 requests per second
});

app.use(cors({
  origin: '*'
}));
app.use(limiter);
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/watchlist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Movie Schema
const movieSchema = new mongoose.Schema({
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  posterPath: { type: String },
  releaseDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create Movie model
const Movie = mongoose.model('Movie', movieSchema);

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// /movies get request to get a paginated, sortable list of movie objects

app.get('/movies', async (req, res) => {
  let {
    // eslint-disable-next-line prefer-const
    cursor = 1, count = 20, sort = 'popularity.desc', query
  } = req.query;

  // Validate and sanitize input
  cursor = parseInt(cursor, 10);
  count = parseInt(count, 10);

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
  } else {
    await axios
      .get('https://api.themoviedb.org/3/discover/movie', { params: queryParams })
      .then((response) => {
        const movies = response.data.results.slice(startIndex, endIndex).map((movie) => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          releaseYear: parseInt(movie.release_date, 10),
          vote_average: movie.vote_average,
          original_language: movie.original_language
        }));

        // Save the data to the cache
        cache[cacheKey] = {
          data: movies,
          expiry: Date.now() + CACHE_DURATION * 1000,
        };

        res.json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  }
});

//  /movies/:id get request to show the details of the full movie object

app.get('/movies/:id', async (req, res) => {
  const movieId = req.params.id;

  // Check if the movie details are already cached
  if (cache[movieId] && cache[movieId].expiry > Date.now()) {
    const cachedData = cache[movieId].data;
    res.json(cachedData);
  } else {
    await axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: {
          api_key: API_KEY
        }
      })
      .then((response) => {
        const movie = response.data;
        // Cache the movie details
        cache[movieId] = {
          data: movie,
          expiry: Date.now() + CACHE_DURATION * 1000,
        };
        res.json(movie);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  }
});

// Watchlist CRUD - Store the movies added to watchlist into MongoDB

// GET /watchlist
app.get('/watchlist', async (req, res) => {
  await Movie.find()
    .sort({ createdAt: -1 })
    // eslint-disable-next-line consistent-return
    .exec((err, movies) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(movies);
    });
});

// POST /watchlist
app.post('/watchlist', async (req, res) => {
  const {
    movieId, title, posterPath, releaseDate
  } = req.body;

  const movie = new Movie({
    movieId,
    title,
    posterPath,
    releaseDate,
  });

  // eslint-disable-next-line consistent-return
  await movie.save((err, savedMovie) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(savedMovie);
  });
});

// PUT /watchlist/:id
app.put('/watchlist/:id', async (req, res) => {
  const movieId = req.params.id;
  const { title, posterPath, releaseDate } = req.body;

  Movie.findOneAndUpdate(
    { movieId },
    {
      title, posterPath, releaseDate, updatedAt: Date.now()
    },
    { new: true },
    // eslint-disable-next-line consistent-return
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
app.delete('/watchlist/:id', async (req, res) => {
  const movieId = req.params.id;

  // eslint-disable-next-line consistent-return
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

const server = app.listen(PORT, () => {
  const host = server.address().address;
  const { port } = server.address();

  console.log('App listening at http://%s:%s', host, port);
});

const httpsServer = https.createServer(options, app);

const HttpsPort = 8443;

httpsServer.listen(HttpsPort, () => {
  console.log(`Server listening on port ${HttpsPort}`);
});

module.exports = server;
