import {apiClient} from "../../../api";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {LoginRequest} from "../../../api/generated";

export const loginAction = createAsyncThunk(
    "user/login",
    async (arg: LoginRequest, thunkAPI) => {
        try {
            const response = await apiClient.login(arg)
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

export const getUserProfileAction = createAsyncThunk(
    "user/get",
    async (arg: undefined, thunkAPI) => {
        try {
            const response = await apiClient.getUser();
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
)

export const createAccountAction = createAsyncThunk(
    "user/create",
    async (arg: undefined, thunkAPI) => {
        try {
            const response = await apiClient.createAccount()
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);
