import express from 'express';
import orderRoutes from './routes/order.routes';
import runKafkaConsumer from './kafka';


const app = express();

app.use(express.json());

app.use('/api/v1/orders', orderRoutes);


const PORT = 3003;

app.listen(PORT, "Order Service is running on ${PORT}");

runKafkaConsumer().catch(console.error);