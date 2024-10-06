import { Kafka } from 'kafkajs';

const kafka1 = new Kafka({
    clientId: 'pratilipi-backend',
    brokers: ['localhost:9092'],
});

export const producer = kafka1.producer();

export const createConsumer = (groupId: string) => {
    return kafka1.consumer({ groupId });
};