
import { producer, createConsumer } from '@repo/shared/kafka';

const userConsumer = createConsumer('usergroup');
const runKafkaConsumer = async () => {
  try {
    await producer.connect();
    await userConsumer.connect();

    await userConsumer.subscribe({ topics: ['orderevents', 'productevents'], fromBeginning: true });

    await userConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
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
            try {

            } catch (error: any) {
              await sendToDLQ(message);
            }
          }
        } catch (outerError: any) {
          console.error(`Error in processing message: ${outerError.message}`);
          await sendToDLQ(message);
        }
      }
    });
  } catch (error) {
    console.error('Error in Kafka consumer:', error);
  }
};

const DLQTOPIC = "userDLQ";
const sendToDLQ = async (message: any) => {
  try {
    await producer.send({
      topic: DLQTOPIC,
      messages: [
        {
          key: message.key,
          value: message.value,
          headers: message.headers,
        },
      ],
    });
    console.log(`Message sent to DLQ: ${message.value.toString()}`);
  } catch (dlqError: any) {
    console.error("Failed to send message to DLQ:", dlqError.message);
  }
};

export default runKafkaConsumer;

