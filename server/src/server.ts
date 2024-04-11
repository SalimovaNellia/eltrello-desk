import mongoose from 'mongoose'; //package to work with mongo DB
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from "express";
import cors from 'cors';

import * as usersController from './controllers/users';
import authMiddleware from './midlewares/auth';

const app = express(); // instance of the express
const httpServer = createServer(app); // http express server
const io = new Server(httpServer); // socket server 

app.use(cors());
app.use(bodyParser.json()); // parse request body from JSON to object
app.use(bodyParser.urlencoded({ extended: true })); // parse url to body object

// add routes
app.get('/', (req, res) => { res.send("API is UP") });
app.post('/api/users', usersController.register);
app.post('/api/users/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);

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

