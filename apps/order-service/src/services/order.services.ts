import {Order}  from '../models/order.model';

export const createOrder = async (data:any) => {
    const newOrder  = new Order(data);
    await newOrder.save();
    return newOrder;
}