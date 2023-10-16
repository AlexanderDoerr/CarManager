// src/kafka/kafkaConsumer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'car-service',
//   brokers: ['localhost:9092']
brokers: ['kafka:29092']
});

const consumer = kafka.consumer({ groupId: 'car-service-group' });

const consumeUserCreatedEvent = async (callback) => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'user-created'});
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            
            const { userId } = JSON.parse(message.value.toString());
            console.log(`Received message: ${userId}`);
            callback(userId);
        },
    });
};

module.exports = {
    consumeUserCreatedEvent
};
