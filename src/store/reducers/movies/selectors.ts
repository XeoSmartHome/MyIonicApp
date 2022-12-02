import {RootState} from "../../index";

export const selectMovies = (store: RootState) => store.movies.movies;
