import { Schema, model } from 'mongoose';


const productSchema = new Schema({
  productId: {type: String, required: true},
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 }, // quantity
  createdAt: { type: Date, default: Date.now }
});

export const Product = model('Product', productSchema);
