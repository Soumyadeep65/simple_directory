/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import server from '../server';

jest.mock('axios');

// Test for /movies endpoint

describe('GET /movies', () => {
  it('should return a paginated, sortable list of movie objects', async () => {
    // Mock the axios get method to return a specific response
    const mockedResponse = {
      data: {
        results: [
          { id: 1, title: 'Movie 1' },
          { id: 2, title: 'Movie 2' },
        ],
      },
    };
    jest.requireMock('axios').get.mockResolvedValue(mockedResponse);

    // Send a GET request to the endpoint
    const response = await request(server).get('/movies');

    // Assert the response status code and body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedResponse.data.results);
  });
});

// Test for /movies/:id endpoint

describe('GET /movies/:id', () => {
  it('should return the movie details', async () => {
    // Mock the axios get method to return a specific response
    const mockedResponse = {
      data: {
        id: 1,
        title: 'Movie Title',
        overview: 'Movie Overview',
      },
    };
    jest.requireMock('axios').get.mockResolvedValue(mockedResponse);

    // Send a GET request to the endpoint
    const response = await request(server).get('/movies/1');

    // Assert the response status code and body
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockedResponse.data);
  });
});

// Test for watchlist crud api

describe('Watchlist CRUD API', () => {
  // Test case for creating a movie in the watchlist
  it('should create a movie in the watchlist', async () => {
    const response = await request(server)
      .post('/watchlist')
      .send({
        movieId: 1, title: 'title', posterPath: 'pp', releaseDate: '02/06/2023'
      });

    expect(response.status).toBe(200);
    expect(response.body.movieId).toBe(1);
  });

  // Test case for getting a movie from the watchlist
  it('should get movies from the watchlist', async () => {
    const response = await request(server).get('/watchlist');

    expect(response.status).toBe(200);
  });

  // Test case for updating a movie in the watchlist
  it('should update a movie in the watchlist', async () => {
    const response = await request(server)
      .put('/watchlist/1')
      .send({ title: 'title2' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('title2');
  });

  // Test case for deleting a movie from the watchlist
  it('should delete a movie from the watchlist', async () => {
    const response = await request(server).delete('/watchlist/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Movie deleted successfully');
  });
});
