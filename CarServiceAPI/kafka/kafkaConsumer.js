// src/kafka/kafkaConsumer.js
const { Kafka } = require('kafkajs');
const sleep = require('sleep-promise');

const kafka = new Kafka({
  clientId: 'car-service',
  brokers: ['localhost:9092']
// brokers: ['kafka:29092']
});



const consumer = kafka.consumer({ groupId: 'car-service-group' });

const connectConsumer = async () => {
    await consumer.connect();
};

const disconnectConsumer = async () => {
    await consumer.disconnect();
};

const consumeUserCreatedEvent = async (callback) => {
    await consumer.subscribe({ topic: 'user-created', fromBeginning: true});
    
    consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { userId } = JSON.parse(message.value.toString());
            console.log(`Received message: ${userId}`);
            callback(userId);
        },
    });
};

// const consumeUserCreatedEvent = async (callback) => {
//     console.log('Waiting 10 seconds to connect to Kafka broker...')
//     await sleep(10000);
//     await consumer.connect();
//     await consumer.subscribe({ topic: 'user-created', fromBeginning: true});
    
//     await consumer.run({
//         eachMessage: async ({ topic, partition, message }) => {
            
//             const { userId } = JSON.parse(message.value.toString());
//             console.log(`Received message: ${userId}`);
//             callback(userId);
//         },
//     });
// };

module.exports = {
    consumeUserCreatedEvent,
    connectConsumer,
    disconnectConsumer
};
