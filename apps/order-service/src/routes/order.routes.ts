import Routes from 'express';
import { placeOrder } from '../controllers/order.controller';

const router =  Routes();
router.post('/api/v1/order', placeOrder);

export default router;


