import { NextFunction, Response } from 'express';
import { Server } from "socket.io";

import { ExpressRequestInterface } from "../types/expressRequest.inerface";
import { SocketEventsEnum } from '../types/socketEvents.enum';
import { Socket } from '../types/socket.interface';
import { getErrorMessage } from '../helpers';
import ColumnModel from '../models/column';


export const getColumns = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction) => {
    try {
        if (!req.user) { return res.sendStatus(401); }
        const columns = await ColumnModel.find({ boardId: req.params.boardId })
        res.send(columns);
    } catch (err) {
        next(err);
    }
};

export const createColumn = async (
    io: Server,
    socket: Socket,
    data: { boardId: string, title: string }
) => {
    try {
        if (!socket.user) {
            socket.emit(SocketEventsEnum.columnsCreateFailure, 'User is not authorised');
            return;
        }
        const newColumn = new ColumnModel({
            userId: socket.user.id,
            boardId: data.boardId,
            title: data.title,
        });

        const savedColumn = await newColumn.save();
        io.to(data.boardId).emit(SocketEventsEnum.columnsCreateSuccess, savedColumn);
    } catch (err) {
        socket.emit(SocketEventsEnum.columnsCreateFailure, getErrorMessage(err));
    }
};

export const deleteColumn = async (
    io: Server,
    socket: Socket,
    data: { boardId: string; columnId: string }
) => {
    try {
        if (!socket.user) {
            socket.emit(SocketEventsEnum.columnsDeleteFailure, 'User is not authorised');
            return;
        }

        await ColumnModel.findByIdAndDelete(data.columnId);
        io.to(data.boardId).emit(SocketEventsEnum.columnsDeleteSuccess);
    } catch (err) {
        socket.emit(SocketEventsEnum.columnsDeleteFailure, getErrorMessage(err));
    }
}
