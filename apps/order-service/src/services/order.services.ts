import {Order}  from '../models/order.model';
import {localProduct}  from '../models/product.model';
import {localUser}  from '../models/user.model';
import {InventoryUpdate, Product, User} from '@repo/shared/types'

export const createOrder = async (data:any) => {
    try {
        const orderId = data.id;
        const orderExists  =  await Order.findOne({_id: orderId});

        if (orderExists) {
            console.log("Order already exists");
            return;
        }

        // check if enough order quantitty exists before succesful order

        const newOrder  = new Order({
            id: orderId,
            user: data.userId,
            product: data.productId,
            quantity: data.quantity
        });
        await newOrder.save();
        console.log('New Order Created:', newOrder);
        return newOrder;
    } catch (error) {
        console.error('Error handling Creating Order in Order Service:', error);        
    }
    
}


export const handleProductCreatedEvent = async (data: Product) => {
    try {
        const productId = data.id;

        // check in own local
        const productExists = await localProduct.findOne({ _id: productId });
        if (productExists) {
            console.log('Product already exists in the catalog.');
            return;
        }

        // not in local, add
        const newProduct = new localProduct({
            _id: productId,
            name: data.name,
            price: data.price,
            stock: data.stock
        });

        await newProduct.save();
        console.log('New product added to local catalog of Order:', newProduct);
        return newProduct;
    } catch (error) {
        console.error('Error handling Product Created event in Order Service:', error);
    }
};

export const handleInventoryUpdateEvent = async (data: InventoryUpdate[]) => {
    try {
        for(const update of data){
            const {id, stock} = update;

            if (!id) {
                throw new Error ("Product ID is required for each update")
            }

            const product = await localProduct.findById(id);
            if (!product) {
                throw new Error (`Product Does not exist for ${id} id`);
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
     const { email, name } = data;  
        if (!email) {
            console.log("No email provided in user registration event");
            return null;  
        }

        const existingUser = await localUser.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", existingUser);
            return existingUser;  
        }

        const newUser = new localUser({
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