
import { producer, consumer } from '@repo/shared/kafka'; 
import {Message}  from 'kafkajs';

const runKafkaConsumer = async () => {
    await producer.connect();
    await consumer.connect();

    await consumer.subscribe({ topic: 'user-events', fromBeginning: true });

    consumer.run({
    eachMessage: async ({ topic, partition, message }: { topic: string; partition: number; message: Message }) => {
      const event = JSON.parse(message.value?.toString() || '');
      if (event.event === 'Order Placed') {
        
      }
    },
  });
};

export default runKafkaConsumer;
 
