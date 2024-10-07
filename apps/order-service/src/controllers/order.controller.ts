import { Request, Response } from 'express';
import { createOrder } from '../services/order.services.js';
import { producer } from '@repo/shared/kafka';


// EVENTS - Order place and Order Ship 
export const placeOrder = async (req: Request, res: Response) => {
  try {

     
    const order = await createOrder(req.body);
    if (!order) {
      return res.status(400).json({ error: "order already exist" });
    }
    
    // Emit Order Placed event to Kafka
    const orderPlacedEventData = {
      orderId: order.id,
      user: order.userId,
      quantity: order.quantity,
      productId: order.productId 
    }

    console.log("kafka data -> orderPlacedEventData", orderPlacedEventData);

    await producer.send({
      topic: 'orderevents',
      messages: [
        { value: JSON.stringify({ event: 'Order Placed', orderPlacedEventData }) },
      ],
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
