import { Schema, model } from 'mongoose';
import { Status } from '@repo/shared/types';

const orderSchema = new Schema({
  orderId: {type: Number, required: true, unique: true},
  userId: { type: String, required: true },
  productId: { type: Number, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, required: true, default: Status.PENDING },
});

export const Order = model('Order', orderSchema);
