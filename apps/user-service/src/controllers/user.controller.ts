import { Request, Response} from "express";
import {createUser, updateUser} from "../services/user.services";
import { producer } from '@repo/shared/kafka';
import { UserRegister, UserUpdate } from "@repo/shared/types";

// Events - User Registered and User Profile Updated
export const registerUser = async (req: Request, res: Response) => {
  try {
    const data: UserRegister = req.body; 
    const user = await createUser(data);
    if (!user) {
      console.log("user not created");
      return;
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
    }
    
    // event to Kafka
    await producer.send({
      topic: 'user-events',
      messages: [
        { value: JSON.stringify({ event: 'User Registered', userData }) },
      ],
    });

    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

 


export const updateUserProfile  = async (req: Request, res: Response) => {
  try {
    const data: UserUpdate = req.body;
    const update = await updateUser(data);

    if (!update) {
       return res.status(404).json({ message: 'User not found' });
    }

    const updatedData = {
      name: update.name,
      email: update.email,
    }

    //only if name has changed
    if (data.name) {
    await producer.send({
      topic: 'user-events',
      messages: [{
        value: JSON.stringify({event: 'User Profile Updated', updatedData})
      }]
    })
      }

    res.status(201).json(update);
    
  } catch (error:any) {
    res.status(400).json({error: error.message});
  }
}