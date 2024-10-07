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
      productId: product.productId,
      name: product.name,
      price: product.price,
      stock: product.stock,
    }

    console.log("data to kafka -> productCreatedEventData", productCreatedEventData);
    
    //Emit Product Created event to Kafka
    await producer.send({
      topic: 'productevents',
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

        const { id } =  req.params; 
        const productId = Number(id);
        if (isNaN(productId)) {
          console.log("productId not exists");
          return res.status(400).json({ error: "Invalid Product ID format." });
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
    
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}


export const updateInventory = async (req: Request, res: Response) => {
  try {

    const updates = req.body;
     if (!Array.isArray(updates)) {
            const message = 'Invalid data format. Expected an array of updates.';
            throw new Error(message);
        }

        const { result, successfullyUpdated, notUpdated} = await inventoryUpdate(updates);

        if (!result) {
          console.log("inventory update return nothing");
          return res.status(204).send(); 
        }

        console.log("inventory update result", result);
        console.log("kafka data for inventory update", successfullyUpdated);

        if (successfullyUpdated.length > 0) {
        await producer.send({
          topic: 'productevents',
          messages: [
            {
              value: JSON.stringify({event: 'Inventory Updated', successfullyUpdated})
            }
          ],
        })
      }

        return res.status(201).json({
          result,
          successfullyUpdated,
          notUpdated
        });
  } catch (err:any) {
    console.log("error in updateInventory ");

      res.status(400).json({ error: err.message });
  }
}


