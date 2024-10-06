import { producer, createConsumer } from '@repo/shared/kafka'; 
import { handleOrderPlacedEvent } from '../services/product.services';

const productConsumer = createConsumer('product-service-group');


const runKafkaConsumer = async () => {
    await producer.connect();
    await productConsumer.connect();

    await productConsumer.subscribe({ topics: ['user-events', 'order-service-events'], fromBeginning: true });

    productConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {

           if (!message.value) {
                return;
            }

          console.log({
                topic,
                partition, 
                offset: message.offset,
                value: message.value.toString(),
            })

      
      const event = JSON.parse(message.value?.toString());
      if (event.event === 'Order Placed') {

        try {

          //update product db
          const updatedProduct = await handleOrderPlacedEvent(event.orderPlacedEventData);

          if (updatedProduct) {
              console.log("Product updated successfully.");
              return;  
          } else {
              console.log("Product update failed.");
              return;  
          }
          
        }catch (error: any) {
          console.error("Error updating product:", error);
          throw new Error(error.message);
        }

      }
    },
  });
};

export default runKafkaConsumer;
 
