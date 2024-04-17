import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';


import { UserDocument } from '../types/user.interface';
import UserModel from '../models/user';
import { secret } from '../config';
import { ExpressRequestInterface } from '../types/expressRequest.inerface';

const normaliseUser = (user: UserDocument) => {
    const token = jwt.sign({ id: user.id, email: user.email }, secret)
    return {
        email: user.email,
        username: user.username,
        id: user.id,
        token: `Bearer ${token}`
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

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email }).select('+password');
        const errors = { emailOrPassword: 'Incorrect email or password' };

        if (!user) {
            console.log(1)
            return res.status(422).json(errors);
        };

        const isPasswordValid = await user.validatePassword(req.body.password);

        if (!isPasswordValid) {
            console.log(await user.validatePassword(req.body.password))
            console.log(req.body.password)

            return res.status(422).json(errors);
        }

        res.send(normaliseUser(user));
    } catch (err) {
        next(err);
    }
}

export const currentUser = (req: ExpressRequestInterface, res: Response) => {
    if (!req.user) {
        return res.sendStatus(401);
    }
    res.send(normaliseUser(req.user));
}