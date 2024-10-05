 
import  {connectDB} from "@repo/shared/db";
import dotenv from 'dotenv';

dotenv.config();

const dbUri = process.env.MONGO_URI_User_Service as string;

export const connectUserDB = () => connectDB(dbUri, 'User Service');
