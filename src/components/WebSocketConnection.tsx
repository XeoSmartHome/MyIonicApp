import {useCallback, useEffect, useState} from "react";
import {useAppDispatch} from "../store";
import {io} from "socket.io-client";
import {getMoviesAction} from "../store/reducers/movies/actions";

const socket = io("http://localhost:5000")

export const WebSocketConnection = () => {
    const dispatch = useAppDispatch();
    const [isConnected, setIsConnected] = useState(socket.connected);

    const reloadData = useCallback(() => {
        dispatch(getMoviesAction({after: ""}));
    }, [dispatch]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log("connected")
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log("disconnected")
            setIsConnected(false);
        });

        socket.on('message', () => {
            console.log("message")
            reloadData();
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };
    }, [reloadData]);

    useEffect(() => {
        console.log("isConnected", isConnected)
    }, [isConnected]);

    return null;
};
