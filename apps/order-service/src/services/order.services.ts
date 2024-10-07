import {Order}  from '../models/order.model';
import {localProduct}  from '../models/product.model';
import {localUser}  from '../models/user.model';
import {InventoryUpdate, Product, User} from '@repo/shared/types'

export const createOrder = async (data:any) => {
    try {
        const orderId = data.orderId;
        const orderExists  =  await Order.findOne({orderId});

        if (orderExists) {
            console.log("Order already exists");
             throw new Error ("Order already exists");
        }

        const userId = data.userId;
        console.log("userId", userId);
        // const userExists = await localUser.findOne({userId: data.userId}) // will be changed for _id
        const userExists = await localUser.findOne({ email: data.userId })
        if (!userExists) {
             console.log("User not exist");
             throw new Error ("User Doesnt Exist");
        }

        const productExists = await localProduct.findOne({productId: data.productId});

        if(!productExists){
            console.log("Product to order doesnt exist");
            throw new Error ("Product doesnt exists");

        }

        const stockAvailaible = productExists.stock;
        const reqQuantity = data.quantity;

        // order only if enough q avaible
        if (reqQuantity > stockAvailaible) {
            throw new Error("not enough quantitty");
        }
        if (reqQuantity <=0) {
            throw new Error("quantity can be 1 or more");
        }

        const newOrder  = new Order({
            orderId,
            userId: data.userId,
            productId: data.productId,
            quantity: data.quantity
        });
        await newOrder.save();
        console.log('New Order Created:', newOrder);
        return newOrder;
    } catch (error: any) {
        console.error('Error handling Creating Order in Order Service:', error); 
        throw new Error(error.message);      
    }
    
}


export const handleProductCreatedEvent = async (data: Product) => {
    try {
        const productId = data.productId;

        // check in own local
        const productExists = await localProduct.findOne({ productId });
        if (productExists) {
            console.log('Product already exists in the catalog.');
            return;
        }

        // not in local, add
        const newProduct = new localProduct({
            productId,
            name: data.name,
            price: data.price,
            stock: data.stock
        });

        await newProduct.save();
        console.log('New product added to local catalog of Order:', newProduct);
        return newProduct;
    } catch (error:any) {
        console.error('Error', error);
        throw new Error(error.message);
    }
};

export const handleInventoryUpdateEvent = async (data: InventoryUpdate[]) => {
    try {
         if (!Array.isArray(data)) {
            throw new Error("Invalid update data format; expected an array.");
        }

        for(const update of data){
            const {id, stock} = update;

            if (!id  || !stock) {
                throw new Error ("Product ID AND Stock is required for each update")
            }

            const product = await localProduct.findOne({productId: id});
            // if (!product) {
            //     console.error(`non-existent product ID: ${id}`);
            //     throw new Error(`Product does not exist for ID ${id}`);
            // }

             if (!product) {
                console.warn(`Product not found: ${id}. Skipping update.`);
                continue; // Skip  
            }
            
            if(typeof stock === 'number'){

                const newStock = product.stock + stock;
                if (newStock < 0) {
                    throw new Error(`Error: Updating stock for product ID ${id} would result in negative quantity.`);
                }
                product.stock = newStock;
            }

            await product.save();
        }

        return { message: 'Inventory updated successfully.' };
    } catch (error:any) {
        throw new Error(error.message);
    }

}


export const handleUserRegisteredEvent = async (data: User) => {
try {
     const { id, email, name } = data;  
        if (!email) {
            console.log("No email provided in user registration event");
            return null;  
        }

        const existingUser = await localUser.findOne({ userId: id });
        if (existingUser) {
            console.log("User already exists:", existingUser);
            return existingUser;  
        }

        const newUser = new localUser({
            userId: id, 
            name,     
            email,    
        });

        await newUser.save();
        console.log('New user added to localUser:', newUser);

        return newUser;  
} catch (error:any) {
    console.error('Error handling User registered event in Order Service:', error.message);
}
}

export const handleUserUpdateEvent =  async (data: User) => {
     try {
        const { email, name } = data;  
        
        if (!email) {
            throw new Error("Email is required for updating user data.");
        }

        const existingUser = await localUser.findOne({ email });
        if (!existingUser) {
            console.log("User not found for email:", email);
            return null; 
        }

        if (name) {
            existingUser.name = name;  
        }

        const updatedUser = await existingUser.save();
        console.log('User profile updated:', updatedUser);

        return updatedUser;  
    } catch (error: any) {
        console.error('Error handling user update event:', error.message);
        throw new Error(error.message);  
    }
};

export const getAllOrders = async (data:any) => {

    try {
        const orders = await Order.find();
        return orders;
    } catch (error:any) {
        throw new Error(error.message);
    }
}

export const findOrder = async (orderId: number) => {
    try {
        
        const order = await Order.findOne({orderId});
        return order;
    } catch (error:any) {
        throw new Error(error.message);
    }
}