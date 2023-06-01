Backend System Design :- 

1) Architecture Overview:

 +--------------+
 | Movie Database API |
 +-------+------+
         |
 +-------v------+
 |   Backend    |
 |   Server     |
 +-------+------+
         |
 +-------v------+
 |   Database   |
 |   (MongoDB)  |
 +--------------+

2) Backend Server Components:

Express.js: The server framework for handling HTTP requests and routing.
Axios: A library for making HTTP requests to the Movie Database API.
MongoDB: A NoSQL database for storing watchlist data.

3) Backend Server Endpoints:

 -> GET /movies: This endpoint provides a paginated and sortable list of "lite" movie objects. It accepts query parameters for cursor position, count, and sort direction.
 -> GET /movies/:id: This endpoint shows the details of a full movie object based on its ID.
CRUD endpoints for watchlist:
-> GET /watchlist: Retrieve all movies in the watchlist.
-> POST /watchlist: Add a movie to the watchlist.
-> DELETE /watchlist/:id: Remove a movie from the watchlist.

4) Backend Server Implementation:

-> The server receives a request at the specified endpoints and handles them using Express.js.
-> For GET /movies, the server uses Axios to fetch data from the Movie Database API, processes the response to retrieve "lite" movie objects, and returns a paginated and sorted list based on the query parameters.
-> For GET /movies/:id, the server uses Axios to fetch the full movie object from the Movie Database API based on the provided movie ID and returns the details.
-> For watchlist CRUD operations, the server interacts with MongoDB to store and retrieve watchlist data.

5) Database Design:

-> MongoDB is used to store watchlist data.
-> The watchlist collection can have the following schema:

{
  _id: ObjectId,
  movieId: Number,
  title: String,
  posterPath: String,
  releaseDate: Date,
  createdAt: Date,
  updatedAt: Date
}

-> _id is the unique identifier for the watchlist item.
-> movieId corresponds to the movie ID from the Movie Database API.
-> title represents the movie title.
-> posterPath stores the path to the movie's poster image.
-> releaseDate indicates the release date of the movie.
-> createdAt and updatedAt track the creation and update timestamps.




