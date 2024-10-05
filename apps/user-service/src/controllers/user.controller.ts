import { Request, Response} from "express";
import {createUser, authenticateUser} from "../services/user.services";
import { producer } from '@repo/shared/kafka';


export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    
    // event to Kafka
    await producer.send({
      topic: 'user-events',
      messages: [
        { value: JSON.stringify({ event: 'User Registered', userId: user._id }) },
      ],
    });

    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const loginUser =  async (req: Request, res: Response) => {

    try {
        const user = await authenticateUser(req.body);
        res.status(200).json(user);
    } catch (err: any) {
        res.status(400).json({error: err.message});
    }
    
};