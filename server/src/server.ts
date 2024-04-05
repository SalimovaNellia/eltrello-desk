import express from "express";
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose'; //package to work with mongo DB

const app = express(); // instance of the express
const httpServer = createServer(app); // http express server
const io = new Server(httpServer); // socket server 


// add route
app.get('/', (req, res) => {
    res.send("API is UP")
});

// open socket connection
io.on('connection', () => {
    console.log("connect");
});

// connect database and start the server
mongoose.connect('mongodb://localhost:27017/eltrello').then(() => {
    console.log('connected to mongodb');

    httpServer.listen(4001, () => {
        console.log('API is listenin g on port 4001');
    });
});

