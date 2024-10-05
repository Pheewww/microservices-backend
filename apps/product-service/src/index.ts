import express from 'express';
import productRoutes from './routes/product.routes'
import runKafkaConsumer from './kafka/index';
import { connectUserDB } from './db';

const app = express();
connectUserDB();

app.use(express.json());

app.use('/api/v1/products', productRoutes);


const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Product service is running on PORT ${PORT}`))

runKafkaConsumer().catch(console.error);