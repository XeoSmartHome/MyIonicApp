import apiRouter from "./src/api";
import mongoose from "mongoose";

const express = require('express');
const app = express();
const cors = require('cors')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

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

app.use(cors());
app.get('/', (req, res) => {
});
app.use('/api', apiRouter);


io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});
