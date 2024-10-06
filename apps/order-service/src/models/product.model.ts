import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
});

export const localProduct = model('LocalProduct', productSchema);
