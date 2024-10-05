
import { producer, consumer } from '@repo/shared/kafka'; 

const runKafkaConsumer = async () => {
    await producer.connect();
    await consumer.connect();

    await consumer.subscribe({ topic: 'user-events', fromBeginning: true });

    consumer.run({
    eachMessage: async ({ topic, partition, message: any}) => {
      const event = JSON.parse(message.value.toString());
      if (event.event === 'User Registered') {
        
      }
    },
  });
};

export default runKafkaConsumer;
 
