import { Schema, model } from 'mongoose';
import validator from "validator";

import { UserDocument } from '../types/user.interface';

const userSchema = new Schema<UserDocument>({ //fields we need in user 
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: [validator.isEmail, 'invalid email'],
        createIndexes: { unique: true }
    },
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
},
    {
        timestamps: true,
    });

export default model<UserDocument>('User', userSchema);