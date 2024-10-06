import { Request, Response } from 'express';
import { createOrder } from '../services/order.services.js';
import { producer } from '@repo/shared/kafka';


// EVENTS - Order place and Order Ship 
export const placeOrder = async (req: Request, res: Response) => {
  try {

     
    const order = await createOrder(req.body);
    if (!order) {
      return;
    }
    
    // Emit Order Placed event to Kafka
    const orderPlacedEventData = {
      orderId: order.id,
      user: order.userId,
      quantity: order.quantity,
      productId: order.productId 
    }

    await producer.send({
      topic: 'order-service-events',
      messages: [
        { value: JSON.stringify({ event: 'Order Placed', orderPlacedEventData }) },
      ],
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
