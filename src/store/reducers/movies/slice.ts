import {createSlice} from "@reduxjs/toolkit";
import {createMovieAction, deleteMovieAction, getMoviesAction, updateMovieAction} from "./actions";
import {Movie} from "../../../api/generated";

export type MoviesState = {
    movies: Movie[];
    nextMovieId?: string;
}

const initialState: MoviesState = {
    movies: []
}

const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMoviesAction.fulfilled, (state, action) => {
            console.log(action.payload)
            state.movies = action.payload.movies;
            state.nextMovieId = action.payload.next;
        });

        builder.addCase(createMovieAction.fulfilled, (state, action) => {
            console.log("createMovieAction.fulfilled", action.payload)
            state.movies.push(action.payload)
        });

        builder.addCase(updateMovieAction.fulfilled, (state, action) => {
            const index = state.movies.findIndex(movie => movie.id === action.payload.id);
            state.movies[index] = action.payload;
        });

        builder.addCase(deleteMovieAction.fulfilled, (state, action) => {
            state.movies = state.movies.filter(movie => movie.id !== action.payload.id);
        });
    },
});

export default moviesSlice;
