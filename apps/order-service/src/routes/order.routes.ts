import Routes from 'express';
import { placeOrder } from '../controllers/order.controller';

const router =  Routes();
router.post('/', placeOrder);

export default router;


