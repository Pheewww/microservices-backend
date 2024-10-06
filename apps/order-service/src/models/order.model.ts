import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, required: true, default: 'pending' },
});

export const Order = model('Order', orderSchema);
