import {createAsyncThunk} from "@reduxjs/toolkit";
import {apiClient} from "../../../api";
import {Movie} from "../../../api/generated";

export const getMoviesAction = createAsyncThunk(
    "movies/get",
    async (arg: { after: string }, thunkAPI) => {
        try {
            const response = await apiClient.getMovies(arg.after);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    },
);

export const createMovieAction = createAsyncThunk(
    "movies/create",
    async (arg: Movie, thunkAPI) => {
        try {
            const response = await apiClient.createMovie(arg);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const updateMovieAction = createAsyncThunk(
    "movies/update",
    async (arg: Movie, thunkAPI) => {
        try {
            const response = await apiClient.updateMovie(arg.id, arg);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const deleteMovieAction = createAsyncThunk(
    "movies/delete",
    async (arg: Movie, thunkAPI) => {
        try {
            const response = await apiClient.deleteMovie(arg.id);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
