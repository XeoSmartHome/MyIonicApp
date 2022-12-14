import {RootState} from "../../index";
export const selectMovies = (store: RootState) => store.movies.movies;

export const selectNextMovieId = (store: RootState) => store.movies.nextMovieId;

export const selectMovieById = (movieId: string) => (store: RootState) => store.movies.movies.find(movie => movie.id === movieId);
