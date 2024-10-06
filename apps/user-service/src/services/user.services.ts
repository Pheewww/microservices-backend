import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserRegister, UserUpdate } from '@repo/shared/types';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || 'default';


export const createUser = async (data: UserRegister) => {
    try {

        const role = data.role && data.role === 'admin' ? 'admin' : 'user';
        const newUser = new User({
            name: data.name,
            email: data.email,
            password: data.password,
            role: role
        });
        await newUser.save();
         const token =  jwt.sign(
        { id: newUser._id, role: newUser.role },
        jwtSecret,
        { expiresIn: '24h' }
    );

    return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token
    }
        
    } catch (error:any) {
        throw new Error(error.message)
    }
   
};



export const updateUser  = async (data: UserUpdate) => {

    try {
        const { email, name, password } = data;
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        if (name) {
            user.name = name;
        }

        if (password) {
            user.password = password; 
        }
        const updatedUser = await user.save();
        return updatedUser;
    } catch (error:any) {
        throw new Error(error.message);
    }



} 