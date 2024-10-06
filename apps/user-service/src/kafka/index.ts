
import { producer, createConsumer } from '@repo/shared/kafka'; 

const userConsumer = createConsumer('usergroup');
const runKafkaConsumer = async () => {
    try {
    await producer.connect();
    await userConsumer.connect();

    await userConsumer.subscribe({ topics: ['orderevents', 'productevents'], fromBeginning: true });

     await userConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) {
          return;
        }

        console.log({
          topic,
          partition,
          offset: message.offset,
          value: message.value.toString(),
        });

        const event = JSON.parse(message.value.toString());
        if (event.event === 'Order Placed') {
          // Handle Order Placed event
        }
      },
    });
  } catch (error) {
    console.error('Error in Kafka consumer:', error);
    // Implement retry logic or graceful shutdown
  }
};

export default runKafkaConsumer;
 
