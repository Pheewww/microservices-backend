import { CreateProduct, InventoryUpdate, Order } from "@repo/shared/types";
import {Product} from "../models/product.model";

export const addProduct = async (data: CreateProduct) => {

    try {

        // check if product exists already - id
        
        const productId = data.productId;
        const productExists = await Product.findOne({productId});
        if (productExists) {
            throw new Error("Product exists already");
        }

    const newProduct = new Product({
        productId,
        name: data.name,
        price: data.price,
        stock: data.stock,
    });
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
    const successfullyUpdated = [];
    const notUpdated = [];

    try {
        for(const update of data){
            const {id, stock} = update;

            if (!id || !stock) {
                const errorMessage = "Product ID AND Stock is required for each update";
                notUpdated.push({ id, error: errorMessage });
                console.error(errorMessage);
                continue; 
            }

            const productId = id;
            const product = await Product.findOne({productId});
            if (!product) {
                const errorMessage = `Product does not exist for ID: ${id}, skipping this update.`;
                notUpdated.push({ id, error: errorMessage });
                console.error(errorMessage);
                continue; 
            }
            
            if(typeof stock === 'number'){

                const newStock = product.stock + stock;
                if (newStock < 0) {
                    const errorMessage = `Error: Updating stock for product ID ${id} would result in negative quantity. Skipping this update.`;
                    notUpdated.push({ id, error: errorMessage });
                     console.error(`Error: Updating stock for product ID ${id} would result in negative quantity. Skipping this update.`);
                    continue; 
                }
                product.stock = newStock;
                successfullyUpdated.push({id: productId, stock})
            }
            console.log("updated product", product);

            await product.save();
        }

        return { result: {message: 'Inventory updated successfully.'}, successfullyUpdated, notUpdated };
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
        { productId: data.productId },
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


