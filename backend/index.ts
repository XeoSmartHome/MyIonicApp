import apiRouter from "./src/api";

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});
app.use('/api', apiRouter);


io.on('connection', (socket) => {
    console.log('a user connected');
});



server.listen(5000, () => {
    console.log('listening on *:5000');
});
