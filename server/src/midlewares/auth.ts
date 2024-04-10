import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ExpressRequestInterface } from '../types/expressRequest.inerface';
import UserModel from '../models/user';
import { secret } from '../config';

export default async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.send(401);
        }

        const token = authHeader.split(" ")[1];
        const data = jwt.verify(token, secret) as { id: string, email: string };
        const user = await UserModel.findById(data.id);

        if (!user) {
            return res.sendStatus(401);
        }

        req.user = user;
        next();

    } catch (err) {
        res.sendStatus(401);
    }
}