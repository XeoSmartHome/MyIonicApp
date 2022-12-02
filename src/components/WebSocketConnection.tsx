import React, {useEffect, useState} from "react";
import {useAppDispatch} from "../store";
import {io} from "socket.io-client";

const socket = io("http://localhost:8080/socket.io")

export const WebSocketConnection = () => {
    const dispatch = useAppDispatch();
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('message', () => {
            console.log("message")
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };
    }, []);

    useEffect(() => {
        console.log("isConnected", isConnected)
    }, [isConnected]);

    return null;
};
