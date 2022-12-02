import {createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {Movie} from "../../../types/movie";

export const getMoviesAction = createAsyncThunk(
    "movies/get",
    async (state, thunkAPI) => {
        try {
            return await fetch("http://localhost:8080/movies").then((response) => response.json());
        } catch (e) {
            console.log(e)
            return thunkAPI.rejectWithValue("error");
        }
    },
);

export const createMovieAction = createAsyncThunk(
    "movies/create",
    async (movie: Movie, thunkAPI) => {
        try {
            return await fetch("http://localhost:8080/movies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(movie)
            }).then((response) => response.json());
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)
