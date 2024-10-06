import { producer, createConsumer } from '@repo/shared/kafka'; 
import { handleInventoryUpdateEvent, handleProductCreatedEvent, handleUserRegisteredEvent, handleUserUpdateEvent } from '../services/order.services';

const orderConsumer = createConsumer('order-service-group');
const runKafkaConsumer = async () => {
    await producer.connect();
    await orderConsumer.connect();

  await orderConsumer.subscribe({ topics: ['product-service-events', 'user-events'], fromBeginning: true });
  
  orderConsumer.run({
        eachMessage: async ({topic, partition, message }) => {

            if(!message.value){
                return;
            }

            console.log({
                topic,  
                partition, 
                offset: message.offset,
                value: message.value.toString(),
            })
            
            const event = JSON.parse(message.value.toString());  

            if (event.event === 'Product Created') {
                //create new product in local 
               try {

                const localproduct = await handleProductCreatedEvent(event.productCreatedEventData);
                console.log("localproduct", localproduct);
                return;
                
               } catch (error:any) {
                throw new Error(error.message);
               } 
            }

            if (event.event === 'Inventory Updated') {
                // update inventory in local
                // list of product id and their stocks
                // map over all product id, create transaction?
                try {
                    const update = await handleInventoryUpdateEvent(event.updates)
                    console.log("inventory update", update);
                    return;
                } catch (error:any) {
                    throw new Error(error.message);
                }
            }

            if (event.event === 'User Registered') {

                try {

                    const newUser  = await handleUserRegisteredEvent(event.userData);
                    console.log("new User Created", newUser);
                    return;
                    
                } catch (error:any) {
                    throw new Error(error.message);
                }
                 
            }

            if (event.event === 'User Profile Updated') {
                try {
                    const update = await handleUserUpdateEvent(event.updatedData);
                    console.log("user new data", update);
                    return;
                } catch (error:any) {
                    throw new Error(error.message);
                }
            }
        },
    });
};

export default runKafkaConsumer;
 
