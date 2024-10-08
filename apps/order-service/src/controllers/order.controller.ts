import { Request, Response } from 'express';
import { createOrder, findOrder, getAllOrders } from '../services/order.services.js';
import { producer } from '@repo/shared/kafka';
import { ObjectId } from 'mongodb';
import { Status } from '@repo/shared/types';
import { Order } from '../models/order.model.js';


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


export const updateOrder  = async (req: Request, res:Response) => {
  try {
    const { orderId, newStatus } = req.body;

    if (!orderId || !newStatus) {
      return res.status(400).json({ message: 'Order ID and new status are required.' });
    }

    
    if (!Object.values(Status).includes(newStatus as Status) || newStatus === Status.PENDING) {
      return res.status(400).json({ message: 'Invalid status. Cannot set status to pending.' });
    }

    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.status === newStatus) {
      return res.status(400).json({ message: `Order is already in ${newStatus} status.` });
    }

    order.status = newStatus as Status;
    await order.save();

    const orderShippedData = order;
    console.log("orderShippedData ", orderShippedData);

    if (order.status === Status.SHIPPED){
      await producer.send({
        topic: 'orderevents',
        messages: [
          { value: JSON.stringify({ event: 'Order Shipped', orderShippedData }) },
        ],
      });
    }
    

    return res.status(200).json({ message: `Order status updated to ${newStatus}.`, order });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};