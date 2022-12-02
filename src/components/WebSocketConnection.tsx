import {useEffect, useState} from "react";
import {useAppDispatch} from "../store";
import {io} from "socket.io-client";

const socket = io("http://localhost:5000")

export const WebSocketConnection = () => {
    const dispatch = useAppDispatch();
    const [isConnected, setIsConnected] = useState(socket.connected);
    console.log("ok")

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
