import { NextFunction, Response } from 'express';

import { ExpressRequestInterface } from "../types/expressRequest.inerface";
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
}