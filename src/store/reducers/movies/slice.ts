import {createSlice} from "@reduxjs/toolkit";
import {Movie} from "../../../types/movie";
import {createMovieAction, getMoviesAction} from "./actions";

type MoviesState = {
    movies: Movie[];
}

const initialState: MoviesState = {
    movies: []
}

const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMoviesAction.pending, (state, action) => {
            console.log("getMovies pending")
        });
        builder.addCase(getMoviesAction.fulfilled, (state, action) => {
            console.log(action.payload)
            state.movies = action.payload;
        });
        builder.addCase(createMovieAction.pending, () => {
            console.log("createMovie pending")
        })
        builder.addCase(createMovieAction.fulfilled, (state, action) => {
            state.movies.push(action.payload)
        })
    },
});

export default moviesSlice;
