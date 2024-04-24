import { NextFunction, Response } from "express";
import { Server, Socket } from "socket.io";

import { ExpressRequestInterface } from "../types/expressRequest.inerface";
import BoardModel from "../models/board"

export const getBoards = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        const boards = await BoardModel.find({ userId: req.user.id });
        res.send(boards);
    } catch (err) {
        next(err);
    }
}

export const createBoard = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction) => {
    try {
        if (!req.user) { return res.sendStatus(401); }
        const newBoard = new BoardModel({
            title: req.body.title,
            userId: req.user.id
        });
        const savedBoard = await newBoard.save();
        res.send(savedBoard);
    } catch (err) {
        next(err);
    }
}

export const getBoard = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction) => {
    try {
        if (!req.user) { return res.sendStatus(401); }
        const board = await BoardModel.findById(req.params.boardId);
        res.send(board);
    } catch (err) {
        next(err);
    }
}

export const joinBoard = async (
    io: Server,
    socket: Socket,
    data: { boardId: string }
) => {
    // join current socket connection to boardId (user will recive all messages from this board)
    socket.join(data.boardId);
}

export const leaveBoard = async (
    io: Server,
    socket: Socket,
    data: { boardId: string }
) => {
    socket.leave(data.boardId);
}