import {configureStore} from "@reduxjs/toolkit";
import {Provider, useDispatch} from "react-redux";
import moviesSlice, {MoviesState} from "./reducers/movies/slice";
import {FC, ReactNode} from "react";
import userSlice, {UserState} from "./reducers/user/slice";
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import CapacitorStorage from 'redux-persist-capacitor';


const store = configureStore({
    reducer: {
        user: persistReducer<UserState>(
            {
                key: 'user',
                storage: CapacitorStorage,
            },
            userSlice.reducer
        ),
        movies: persistReducer<MoviesState>(
            {
                key: 'movies',
                storage: CapacitorStorage,
            },
            moviesSlice.reducer
        )
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

const persistor = persistStore(store);

export const StoreProvider: FC<{ children: ReactNode }> = ({children}) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
};
