import { Request, Response} from "express";
import { ObjectId } from 'mongodb';
import {createUser, findUser, getAllUsers, updateUser} from "../services/user.services";
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

    console.log("new user created", user);

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    console.log("data to kafka -> userData", userData);
    
    //event to Kafka
    await producer.send({
      topic: 'userevents',
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

    console.log("data to kafka -> updatedData", updatedData);


    // only if name has changed
    if (data.name) {
    await producer.send({
      topic: 'userevents',
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

export const allUsers = async (req:Request, res:Response) => {
  try {

    const userList = await getAllUsers(req.body);
    if (!userList) {
      res.status(400).json({ error: "users can;t be retrieved" });
    }

    console.log("userList", userList);

    return userList;

  } catch (error: any) {
    res.status(400).json({ error: error.message });

  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      console.log("USer ID is needed");
      return res.status(400).json({ error: "User ID doesnt exist" });

    }
    if (!ObjectId.isValid(id)) {
      console.log("User Doesn;t Exist");
      return res.status(400).json({ error: "User Id Has To Be Valid Doc Id" });
    }

    const user = await findUser(id);

    if (!user) {
      console.log("User not found");
      res.status(404).json({ error: "User Not found" });
    }

    return res.status(200).json(user);

  } catch (error: any) {

    res.status(400).json(error.message);

  }
}