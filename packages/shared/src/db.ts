 
import mongoose from 'mongoose';

export const connectDB = async (dbUri: string, serviceName: string) => {
    try {
        const conn = await mongoose.connect(dbUri);
        console.log(`${serviceName} DB connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
