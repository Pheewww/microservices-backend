import { Request, Response } from 'express';
import { addProduct, listProduct, listAllProduct, inventoryUpdate } from '../services/product.services';
import { producer } from '@repo/shared/kafka';


// EVENTS - Product Created and Inventory Updated() 

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await addProduct(req.body);
    if (!product) {
      return;
    }
    const productCreatedEventData = {
      productId: product._id,
      name: product.name,
      price: product.price
    }
    
    // Emit Product Created event to Kafka
    await producer.send({
      topic: 'product-service-events',
      messages: [
        { value: JSON.stringify({ event: 'Product Created', productCreatedEventData }) },
      ],
    });

    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


export const getProduct = async (req: Request, res:Response ): Promise<Response>  => {
    //const product  = req.body;
    try {

        const productId =  req.params.id; 

        if (!productId) {
          console.log("productId not exists");
          return res.status(400).json({ error: "Product ID is required" });
        }

        const product = await listProduct(productId);

         if (!product) {
            return res.status(404).json({ error: "Product not found" });
         }

          return res.status(200).json(product); 

    } catch (err:any) {

          return res.status(400).json({error: err.message});

    }
} 

export const getAllProduct = async (req: Request, res: Response) => {

  try {
    const allProductList = await listAllProduct(req.body);
    console.log("allProductList", allProductList);
    res.status(201).json(allProductList);
    
  } catch (error: any) {
    throw new Error(error.message);
  }
}


export const updateInventory = async (req: Request, res: Response) => {
  try {

    const updates = req.body;
     if (!Array.isArray(updates)) {
            const message = 'Invalid data format. Expected an array of updates.';
            throw new Error(message);
        }

        const result = await inventoryUpdate(updates);

        await producer.send({
          topic: 'product-service-events',
          messages: [
            {
              value: JSON.stringify({event: 'Inventory Updated', updates})
            }
          ],
        })

        return res.status(201).json(result);
  } catch (error:any) {
    throw new Error(error.message);
  }
}


