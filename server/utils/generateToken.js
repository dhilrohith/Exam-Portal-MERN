// generates token

import jwt from 'jsonwebtoken';
import {
     JWT_SECRET, JWT_EXPIRES_IN
} from './config.js';

export const generateToken = (user)=>{
    return jwt.sign(
    {
        id: user._id,
        email: user.email,
        role: user.role
    },
    JWT_SECRET,
    {expiresIn:JWT_EXPIRES_IN || '1d'}
    );
}