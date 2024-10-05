
import { producer, consumer } from '@repo/shared/kafka'; 

const runKafkaConsumer = async () => {
    await producer.connect();
    await consumer.connect();

    await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

    consumer.run({
        eachMessage: async ({ topic, partition, message:any }) => {
            const event = JSON.parse(message.value.toString());
            if (event.event === 'Order Placed') {
                
            }
        },
    });
};

export default runKafkaConsumer;
 
