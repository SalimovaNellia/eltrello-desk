import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

import { UserDocument } from '../types/user.interface';

const userSchema = new Schema<UserDocument>({
    //fields we need in user 
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
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err as Error);
    }
});



export default model<UserDocument>('User', userSchema);