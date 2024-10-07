import { Request, Response } from 'express';
import { createOrder, findOrder, getAllOrders } from '../services/order.services.js';
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


export const allOrders = async (req: Request, res: Response) => {
  try {

    const orderList = await getAllOrders(req.body);
    if (!orderList) {
      res.status(400).json({ error: "orders can;t be retrieved"});
    }
    
    console.log("orderList", orderList);

    return orderList;
    
  } catch (error:any) {
    res.status(400).json({ error: error.message });
    
  }
}

export const orderDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const orderId = Number(id);
    if (isNaN(orderId)) {
      console.log("Order Doesn;t Exist");
      return res.status(400).json({error: "Order Id Has To Be Number"});
    }

    const order = await findOrder(orderId);
    if (!order) {
      console.log("order not found");
      res.status(404).json({ error: "Order Not found" });
    }

    return res.status(200).json(order);

  } catch (error:any) {

    res.status(400).json(error.message);
    
  }
}