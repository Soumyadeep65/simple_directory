System design for the frontend application :-

1) User Interface (UI) Components:

-> MovieList: Renders the list of movies with tile view and infinite scroll functionality.
-> MovieFilter: Displays a dropdown filter for selecting release year and language.
-> MovieSort: Provides options to sort movies by top-rated first.
-> MovieDetails: Shows the details of a selected movie.
-> WatchlistCenter: Manages the watchlist and allows marking movies as watched.

2)State Management with Redux:

->Create a Redux store to manage the application state.
-> Use createSlice from redux/toolkit to define reducers and actions for managing API data.
-> Define actions to fetch movies based on filters and sort criteria.
-> Store the fetched movies in the Redux store.
-> Implement actions to add movies to the watchlist and mark movies as watched.

3)API Integration:

->Use axios or any other HTTP client library to make API requests to the backend server.
-> Create API endpoints on the backend to handle movie filtering, sorting, and watchlist operations.
-> Utilize the defined endpoints to fetch movies based on filters and sort criteria.
-> Implement endpoints for adding movies to the watchlist and marking movies as watched.

4) React Components and Routing:

->Create the necessary React components for each page or feature (e.g., MovieList, MovieDetails, WatchlistCenter).
-> Set up routing using a library like react-router to navigate between pages.
-> Define routes for the movie list, movie details, and watchlist center pages.

5)User Interactions and Functionality:

-> Connect the UI components to the Redux store using react-redux and useSelector/useDispatch hooks.
-> Implement event handlers for filtering movies based on release year and language.
-> Add event handlers for sorting movies by top-rated first.
-> Implement infinite scroll functionality in the MovieList component to load more movies as the user scrolls.
-> Provide the ability to add movies to the watchlist and mark movies as watched in the MovieDetails and WatchlistCenter components.

6) Redux DevTools and Middleware:

-> Enable Redux DevTools for easier debugging and monitoring of the Redux store.
-> Use middleware like redux-thunk or redux-saga to handle asynchronous actions, such as API requests.

7) TypeScript Integration:

-> Use TypeScript as the programming language for type safety and better code development experience.
-> Define interfaces or types for the API responses, Redux store, and other data structures used in the application.