import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';


import { UserDocument } from '../types/user.interface';
import UserModel from '../models/user';
import { secret } from '../config';

const normaliseUser = (user: UserDocument) => {
    const token = jwt.sign({ id: user.id, email: user.email }, secret)
    return {
        email: user.email,
        username: user.username,
        id: user.id,
    }
}

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const newUser = new UserModel({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        const savedUser = await newUser.save();
        res.send(normaliseUser(savedUser));

    } catch (err) {
        if (err instanceof Error.ValidationError) {
            const messages = Object.values(err.errors).map((err) => err.message);
            return res.status(422).json(messages);
        }
        next(err);
    }
}