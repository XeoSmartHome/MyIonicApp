import apiRouter, {APP_SECRET} from "./src/api";
import mongoose, {connections} from "mongoose";
import {verify} from "jsonwebtoken";
import {setIo} from "./src/connections";

const express = require('express');
const app = express();
const cors = require('cors')
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");

mongoose.connect('mongodb://127.0.0.1:27017/MyIonicApp').then(() => {
    console.log("Connected to database");
}).catch((error) => {
    console.log("Error connecting to database", error);
});

const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

setIo(io);

app.use(cors());
app.get('/', (req, res) => {
});
app.use('/api', apiRouter);


io.on('connection', (socket) => {
    const token = socket.handshake.headers["x-access-token"];
    if (!token) {
        return socket.disconnect();
    }
    try {
        const decoded = verify(token, APP_SECRET);
        const {userId} = decoded as { userId: string };
        if (!userId) {
            return socket.disconnect();
        }
        socket.join(userId);
    } catch (e) {
        return socket.disconnect();
    }
    console.log('a user connected');
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});
