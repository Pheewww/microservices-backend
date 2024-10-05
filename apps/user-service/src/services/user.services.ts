import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || 'default';


export const createUser = async (data: any): Promise<IUser> => {
    const newUser = new User(data);
    await newUser.save();
    return newUser;
};

export const authenticateUser = async (data: any) => {
    const user = await User.findOne({
        email: data.email
    });

    if (!user) {
        throw new Error('Invalid Email');
    }

    const checkPassword = await user.comparePassword(data.password);
    if (!checkPassword) {
        throw new Error('Invalid Password');
    }

    return jwt.sign(
        { id: user._id },
        jwtSecret,
        { expiresIn: '24h' }
    );
};