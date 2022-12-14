import {useCallback, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../store";
import {io} from "socket.io-client";
import {getMoviesAction} from "../store/reducers/movies/actions";
import {useIonToast} from "@ionic/react";
import {getStore} from "../store/refference";

export const WebSocketConnection = () => {
    const dispatch = useAppDispatch();
    const [isConnected, setIsConnected] = useState(false);
    const [showToast] = useIonToast();

    const reloadData = useCallback(() => {
        dispatch(getMoviesAction({after: ""})).unwrap().then(() => {
            showToast({
                message: "Movies reloaded",
                duration: 2000,
                color: "warning",
            });
        });
    }, [dispatch, showToast]);

    const accessToken = useAppSelector(state => state.user.accessToken);

    useEffect(() => {
        if(accessToken) {
            const socket = io("http://localhost:5000", {
                extraHeaders: {
                    "x-access-token": accessToken
                }
            });
            socket.on('connect', () => {
                console.log("connected")
                setIsConnected(true);
            });

            socket.on('disconnect', () => {
                console.log("disconnected")
                setIsConnected(false);
            });

            socket.on('update', () => {
                console.log("reloading data")
                reloadData();
            });

            return () => {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('pong');
            };
        }
    }, [reloadData, accessToken]);

    useEffect(() => {
        console.log("isConnected", isConnected)
    }, [isConnected]);

    return null;
};
