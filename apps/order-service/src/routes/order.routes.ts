import Routes from 'express';
import { allOrders, orderDetail, placeOrder } from '../controllers/order.controller';

const router =  Routes();
router.post('/', placeOrder);
router.get('/', allOrders);
router.get('/:id', orderDetail);
// router.get('/update', updateOrder);

export default router;


