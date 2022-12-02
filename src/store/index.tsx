import {configureStore} from "@reduxjs/toolkit";
import {Provider, useDispatch} from "react-redux";
import moviesSlice from "./reducers/movies/slice";
import {FC, ReactNode} from "react";

const store = configureStore({
    reducer: {
        movies: moviesSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

export const StoreProvider: FC<{ children: ReactNode }> = ({children}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}
