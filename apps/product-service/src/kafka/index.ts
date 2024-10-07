import { producer, createConsumer } from "@repo/shared/kafka";
import { handleOrderPlacedEvent } from "../services/product.services";

const productConsumer = createConsumer("productgroup");

const runKafkaConsumer = async () => {
  try {
    await producer.connect();
    await productConsumer.connect();

    await productConsumer.subscribe({
      topics: ["userevents", "orderevents"],
      fromBeginning: true,
    });

    productConsumer.run({
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

          const event = JSON.parse(message.value?.toString());

          if (event.event === "Order Placed") {

            try {

              //update product db
              const updatedProduct = await handleOrderPlacedEvent(
                event.orderPlacedEventData
              );

              if (updatedProduct) {
                console.log("Product updated successfully.");
                return;
              } else {
                console.log("Product update failed.");
                return;
              }

            } catch (error: any) {

              console.error("Error updating product:", error.message);
              await sendToDLQ(message);

            }
          }

        } catch (outerError: any) {

          console.error(`Error in processing message: ${outerError.message}`);
          await sendToDLQ(message);

        }
      },
    });
  } catch (error) {
    console.error("Error in Kafka consumer:", error);
  }
};

const DLQTOPIC = "productDLQ";
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
