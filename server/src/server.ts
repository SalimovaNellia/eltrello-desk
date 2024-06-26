import mongoose from 'mongoose'; //package to work with mongo DB
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import express from 'express';
import cors from 'cors';

import { SocketEventsEnum } from './types/socketEvents.enum';
import * as columnsController from './controllers/columns';
import * as boardsController from './controllers/boards';
import * as usersController from './controllers/users';
import * as tasksController from './controllers/tasks';
import { Socket } from './types/socket.interface';
import authMiddleware from './midlewares/auth';
import { secret } from './config';
import User from './models/user';

const app = express(); // instance of the express
const httpServer = createServer(app); // http express server
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
}); // socket server 

app.use(cors());
app.use(bodyParser.json()); // parse request body from JSON to object
app.use(bodyParser.urlencoded({ extended: true })); // parse url to body object

//remove '_' from id property
mongoose.set('toJSON', {
    virtuals: true,
    transform: (_, coverted) => {
        delete coverted._id;
    },
});

// add routes
app.get('/', (req, res) => { res.send("API is UP") });

app.post('/api/users', usersController.register);
app.post('/api/users/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);

app.get('/api/boards', authMiddleware, boardsController.getBoards);
app.post('/api/boards', authMiddleware, boardsController.createBoard);
app.get('/api/boards/:boardId', authMiddleware, boardsController.getBoard);
app.get('/api/boards/:boardId/columns', authMiddleware, columnsController.getColumns);
app.get('/api/boards/:boardId/tasks', authMiddleware, tasksController.getTasks);

// open socket connection
io.use(async (socket: Socket, next) => {
    try {
        const token = (socket.handshake.auth.token as string) ?? "";
        const data = jwt.verify(token.split(' ')[1], secret) as {
            id: string;
            email: string;
        };
        const user = await User.findById(data.id);

        if (!user) {
            return next(new Error('Authentication error'));
        }
        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
}).on('connection', (socket) => {
    socket.on(SocketEventsEnum.boardsJoin, (data) => {
        boardsController.joinBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.boardsLeave, (data) => {
        boardsController.leaveBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.boardsUpdate, (data) => {
        boardsController.updateBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.boardsDelete, (data) => {
        boardsController.deleteBoard(io, socket, data);
    });
    socket.on(SocketEventsEnum.columnsCreate, (data) => {
        columnsController.createColumn(io, socket, data);
    });
    socket.on(SocketEventsEnum.columnsUpdate, (data) => {
        columnsController.updateColumn(io, socket, data);
    });
    socket.on(SocketEventsEnum.columnsDelete, (data) => {
        columnsController.deleteColumn(io, socket, data);
    });
    socket.on(SocketEventsEnum.tasksCreate, (data) => {
        tasksController.createTask(io, socket, data);
    });
    socket.on(SocketEventsEnum.tasksUpdate, (data) => {
        tasksController.updateTask(io, socket, data);
    });
    socket.on(SocketEventsEnum.tasksDelete, (data) => {
        tasksController.deleteTask(io, socket, data);
    });
});

// connect database and start the server
mongoose.connect('mongodb://localhost:27017/eltrello').then(() => {
    console.log('connected to mongodb');

    httpServer.listen(4001, () => {
        console.log('API is listenin g on port 4001');
    });
});

