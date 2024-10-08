import { Request, Response } from 'express';
import { createOrder, findOrder, getAllOrders } from '../services/order.services.js';
import { producer } from '@repo/shared/kafka';
import { ObjectId } from 'mongodb';


// EVENTS - Order place and Order Ship 
export const placeOrder = async (req: Request, res: Response) => {
  try {

     
    const order = await createOrder(req.body);
    if (!order) {
      return res.status(400).json({ error: "order already exist" });
    }
    
    // Emit Order Placed event to Kafka
    const orderPlacedEventData = {
      id: order._id,
      orderId: order.orderId,
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

    return res.status(201).json(order);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};


export const allOrders = async (req: Request, res: Response) => {
  try {

    const orderList = await getAllOrders();
    if (!orderList) {
      return res.status(400).json({ error: "orders can;t be retrieved"});
    }
    
    console.log("orderList", orderList);

    return res.status(201).json(orderList);
    
  } catch (error:any) {
    return res.status(400).json({ error: error.message });
    
  }
}

export const orderDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      console.log("Order ID is needed");
      return res.status(400).json({ error: "Order ID doesnt exist" });

    }

    if (!ObjectId.isValid(id)) {
      console.log("Order Doesn;t Exist");
      return res.status(400).json({ error: "Order Id Has To Be Valid Doc Id" });
    }

    const order = await findOrder(id);
    if (!order) {
      console.log("order not found");
      return res.status(404).json({ error: "Order Not found" });
    }

    return res.status(200).json(order);

  } catch (error:any) {

    return res.status(400).json(error.message);

  }
}