import {Product} from "../models/product.model";

export const addProduct = async (data:any) => {
    const newProduct = new Product(data);
    await newProduct.save();
    return newProduct;
}

export const listProduct = async (data: any) => {
    return Product.find();
} 