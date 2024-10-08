import Routes from 'express';
import { allOrders, orderDetail, placeOrder, updateOrder } from '../controllers/order.controller';

const router =  Routes();
router.post('/', placeOrder);
router.get('/', allOrders);
router.get('/:id', orderDetail);
router.put('/update', updateOrder);

export default router;


