import { InventoryUpdate, Order } from "@repo/shared/types";
import {Product} from "../models/product.model";

export const addProduct = async (data:any) => {

    try {
    const newProduct = new Product(data);
    await newProduct.save();
    return newProduct;
        
    } catch (error:any) {
          throw new Error(error.message);
    }
    
}

export const listProduct = async (productId: number) => {
    
    try {
        const product  = await Product.findOne({productId});
        return product;
    } catch (error:any) {
        throw new Error(error.message);
    }
} 

export const listAllProduct = async (data: any) => {
    
    try {
        const products = await Product.find();
        return products;
    } catch (error:any) {
        throw new Error(error.message);
    }
}

export const inventoryUpdate = async (data: InventoryUpdate[]) => {
    try {
        for(const update of data){
            const {id, stock} = update;

            if (!id) {
                throw new Error ("Product ID is required for each update")
            }

            const productId = id;
            const product = await Product.findOne({productId});
            if (!product) {
                throw new Error (`Product Does not exist for ${id} id`);
            }
            
            if(typeof stock === 'number'){

                const newStock = product.stock + stock;
                if (newStock < 0) {
                    throw new Error(`Error: Updating stock for product ID ${id}, would result in negative quantity. Other products have been updated`);
                }
                product.stock = newStock;
            }
            console.log("updated product", product);

            await product.save();
        }

        return { message: 'Inventory updated successfully.' };
    } catch (error:any) {
        console.log("error in inventory block");
        throw new Error(error.message);
    }

}

export const handleOrderPlacedEvent = async (data: Order) => {

    try{

        const findProduct = await Product.findOne({ productId: data.productId});

        if (!findProduct) {
          console.log("this product diesnt exits");
         return;
        }

        //update quantity based on order -> stock decreases
        const quantityBefore = findProduct.stock;
        const orderQuantity = data.quantity;
        if (orderQuantity <= 0) {
            throw new Error("Error: Order quantity must be greater than zero.");
        }

        const productQuantityUpdate  = quantityBefore - orderQuantity;
        if (productQuantityUpdate < 0) {
            throw new Error("Error: Product quantity can't be negative.");
        }

        const updatedProduct = await Product.updateOne(
        { _id: data.productId },
        { $set: { stock: productQuantityUpdate } }
        );

        if (!updatedProduct) {
           throw new Error("Can't update stock in product");
        }

        return true;

    } catch (error) {
        console.error("Error handling order placed event:", error);
        return false;
    }
}


