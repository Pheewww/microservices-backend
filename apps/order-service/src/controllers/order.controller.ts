import { Request, Response } from 'express';
import { createOrder } from '../services/order.services.js';
import { producer } from '@repo/shared/kafka';

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const order = await createOrder(req.body);
    
    // Emit Order Placed event to Kafka
    await producer.send({
      topic: 'order-events',
      messages: [
        { value: JSON.stringify({ event: 'Order Placed', orderId: order._id }) },
      ],
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
