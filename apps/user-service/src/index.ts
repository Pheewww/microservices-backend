import express from "express";
import userRoutes from "./routes/user.routes";
import runKafkaConsumer  from './kafka'

const app  =  express();

app.use(express.json());

app.use("/api/v1/users", userRoutes);

const PORT  =  process.env.PORT || 3001;

app.listen(PORT, () => console.log(`User service is runnning on PORT ${PORT}`));

runKafkaConsumer().catch(console.error);