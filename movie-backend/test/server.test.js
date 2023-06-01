/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import server from '../server';

jest.mock('axios');

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
