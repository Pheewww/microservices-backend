import { producer, createConsumer } from '@repo/shared/kafka'; 
import { handleInventoryUpdateEvent, handleProductCreatedEvent, handleUserRegisteredEvent, handleUserUpdateEvent } from '../services/order.services';

const orderConsumer = createConsumer('ordergroup');
const runKafkaConsumer = async () => {
    try {
    await producer.connect();
    await orderConsumer.connect();

  await orderConsumer.subscribe({ topics: ['productevents', 'userevents'], fromBeginning: true });
  
  
  await orderConsumer.run({
    
        eachMessage: async ({topic, partition, message }) => {
            try {
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
                    console.error(`Error processing 'Product Created': ${error.message}`);
                    await sendToDLQ(message);
               } 
            }

            if (event.event === 'Inventory Updated') {
                // update inventory in local
                // list of product id and their stocks
                // map over all product id, create transaction?
                try {
                    const update = await handleInventoryUpdateEvent(event.successfullyUpdated)
                    console.log("inventory update", update);
                    return;
                } catch (error:any) {
                     console.error(`Error processing 'Inventory Updated': ${error.message}`);
                    await sendToDLQ(message);
                }
            }

            if (event.event === 'User Registered') {

                try {

                    const newUser  = await handleUserRegisteredEvent(event.userData);
                    console.log("new User Created", newUser);
                    return;
                    
                } catch (error:any) {
                        console.error(`Error processing 'User Registered': ${error.message}`);
                        await sendToDLQ(message);
                }
                 
            }

            if (event.event === 'User Profile Updated') {
                    try {
                        const update = await handleUserUpdateEvent(event.updatedData);
                        console.log("user new data", update);
                        return;
                    } catch (error:any) {
                        console.error(`Error processing 'User Profile Updated': ${error.message}`);
                        await sendToDLQ(message);
                    }
                }
            }catch (outerError: any) {
                    console.error(`Error in processing message: ${outerError.message}`);
                    await sendToDLQ(message);
                }
            }
    });
  } catch (error) {
    console.error('Error in Kafka consumer:', error);
  }
}

const DLQTOPIC = 'OrderDLQ';
const sendToDLQ = async (message: any) => {
    try {
        await producer.send({
            topic: DLQTOPIC,
            messages: [
                {
                    key: message.key,  
                    value: message.value,  
                    headers: message.headers  
                }
            ]
        });
        console.log(`Message sent to DLQ: ${message.value.toString()}`);
    } catch (dlqError:any) {
        console.error('Failed to send message to DLQ:', dlqError.message);
    }
};


export default runKafkaConsumer;
 
