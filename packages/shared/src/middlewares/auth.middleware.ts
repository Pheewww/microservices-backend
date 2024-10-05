import {Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || 'default'; 
interface CustomRequest extends Request {
    user: any;  
}

export const authenticateUser  = (req: CustomRequest, res: Response, next: NextFunction ) => {
    const token  = req.headers['authorization'];
    if (!token) {
        return res.status(400).json({message: 'Token required in header'});
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({message: 'Invalid Token'});
        }
        req.user = user;
        next();
    } )
}