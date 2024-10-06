import express from 'express';
import orderRoutes from './routes/order.routes.js';
import runKafkaConsumer from './kafka/index.js';
import { connectUserDB } from './db.js';

const app = express();
connectUserDB();

app.use(express.json());

app.use('/api/v1/order', orderRoutes);


const PORT = 3003;

app.listen(PORT, () => console.log(`Order Service is running on ${PORT}`));

//runKafkaConsumer().catch(console.error);