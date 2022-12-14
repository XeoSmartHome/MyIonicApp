import {User} from "../../../api/generated";
import {createSlice} from "@reduxjs/toolkit";
import {createAccountAction, getUserProfileAction, loginAction} from "./actions";

export type UserState = {
    user: User | null
    accessToken: string | null
}

const initialState: UserState = {
    user: null,
    accessToken: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginAction.fulfilled, (state, action) => {
            state.accessToken = action.payload.token;
        });

        builder.addCase(getUserProfileAction.fulfilled, (state, action) => {
            state.user = action.payload;
        });

        builder.addCase(createAccountAction.fulfilled, (state, action) => {
        });
    }
});

export default userSlice;
