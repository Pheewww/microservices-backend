import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { UserRegister, UserUpdate } from '@repo/shared/types';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || 'default';

//hash password

export const createUser = async (data: UserRegister) => {
    try {

        const role = data.role && data.role === 'admin' ? 'admin' : 'user';
        //check if user exists already
        // email verify?

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
        role,
        token
    }
        
    } catch (error:any) {
        throw new Error(error.message)
    }
   
};

export const updateUser  = async (data: UserUpdate) => {

    try {
        const { id, email, name, password } = data;
        const user = await User.findById({ _id: id });

        if (!user) {
            throw new Error('User not found');
        }

        if (name) {
            user.name = name;
        }

        if (email) {
            user.email = email;
            
        }

        if (password) {
            user.password = password; 
        }
        const updatedUser = await user.save();
        return {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        };
    } catch (error:any) {
        throw new Error(error.message);
    }



}

export const findUser = async (userId: string) => {
    try {

        const user = await User.findById({ _id: new ObjectId(userId) });
        return user;
    } catch (error: any) {
        throw new Error(error.message);
    }

}

export const getAllUsers = async (data: any) => {

    try {
        const users = await User.find();
        return users;
    } catch (error: any) {
        throw new Error(error.message);
    }
}