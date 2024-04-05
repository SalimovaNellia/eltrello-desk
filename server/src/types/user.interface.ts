import { Document } from 'mongoose';

export interface User {
    email: string;
    username: string;
    password: string;
    createAt: Date;
}

export interface UserDocument extends User, Document { } // model for mongoose