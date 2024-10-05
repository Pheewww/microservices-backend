import { Request, Response } from 'express';
import { addProduct, listProduct } from '../services/product.services';
import { producer } from '@repo/shared/kafka';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await addProduct(req.body);
    
    // Emit Product Created event to Kafka
    await producer.send({
      topic: 'product-events',
      messages: [
        { value: JSON.stringify({ event: 'Product Created', productId: product._id }) },
      ],
    });

    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


export const getProduct = async (req: Request, res:Response ) => {
    //const product  = req.body;
    try {
        const productList = await listProduct(req.body);
        res.status(200).json(productList); 
    } catch (err:any) {
        res.status(400).json({error: err.message});
    }
} 