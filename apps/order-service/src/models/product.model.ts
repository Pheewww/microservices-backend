import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  id: {type: String, required: true},
  productId: { type: Number, required: true, unique: true},
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const localProduct = model('LocalProduct', productSchema);
