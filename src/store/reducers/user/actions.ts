import {apiClient} from "../../../api";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {CreateAccountRequest, LoginRequest} from "../../../api/generated";

export const loginAction = createAsyncThunk(
    "user/login",
    async (arg: LoginRequest, thunkAPI) => {
        try {
            const response = await apiClient.login(arg)
            return response.data;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const getUserProfileAction = createAsyncThunk(
    "user/get",
    async (arg: undefined, thunkAPI) => {
        try {
            const response = await apiClient.getUser();
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const createAccountAction = createAsyncThunk(
    "user/create",
    async (arg: CreateAccountRequest, thunkAPI) => {
        try {
            const response = await apiClient.createAccount(arg)
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
