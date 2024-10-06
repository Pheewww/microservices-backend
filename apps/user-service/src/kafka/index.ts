
import { producer, createConsumer } from '@repo/shared/kafka'; 

const userConsumer = createConsumer('user-service-group');
const runKafkaConsumer = async () => {
    await producer.connect();
    await userConsumer.connect();

    await userConsumer.subscribe({ topics: ['order-service-events', 'product-service-events'], fromBeginning: true });

    userConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {

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
            if (event.event === 'Order Placed') {
                
            }
        },
    });
};

export default runKafkaConsumer;
 
