import { Request, Response } from 'express';
import { addProduct, listProduct, listAllProduct, inventoryUpdate } from '../services/product.services';
import { producer } from '@repo/shared/kafka';
import { ObjectId } from 'mongodb';


// EVENTS - Product Created and Inventory Updated() 

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await addProduct(req.body);
    if (!product) {
      return;
    }
    const productCreatedEventData = {
      id: product._id,
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

    return res.status(201).json(product);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};


export const getProduct = async (req: Request, res:Response ): Promise<Response>  => {
    //const product  = req.body;
    try {

        const { id } =  req.params; 
      if (!id) {
        console.log("Product ID is needed");
        return res.status(400).json({ error: "Product ID doesnt exist" });

      }

      if (!ObjectId.isValid(id)) {
        console.log("Prodcuct Doesn;t Exist");
        return res.status(400).json({ error: "Product Id Has To Be Valid Doc Id" });
      }

        const product = await listProduct(id);

         if (!product) {
           console.log("Product not found");
            return res.status(404).json({ error: "Product not found" });
         }

          return res.status(200).json(product); 

    } catch (err:any) {

          return res.status(400).json({error: err.message});

    }
} 

export const getAllProduct = async (req: Request, res: Response) => {

  try {
    const allProductList = await listAllProduct();
    console.log("allProductList", allProductList);
    return res.status(201).json(allProductList);
    
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
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

      return res.status(400).json({ error: err.message });
  }
}


