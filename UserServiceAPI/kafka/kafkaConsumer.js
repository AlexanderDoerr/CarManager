const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['kafka:29092']
    // brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'user-service-group' });

const connectConsumer = async () => {   
    await consumer.connect();
};

const disconnectConsumer = async () => {
    await consumer.disconnect();
};

const consumeEmailRequestEvent = async (callback) => {
    await consumer.subscribe({ topic: 'user-email-request', fromBeginning: true });
    
    consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { userId, reminderId } = JSON.parse(message.value.toString());
            console.log(`Received message for email: ${userId}, reminderId: ${reminderId}`);
            callback(userId, reminderId);
        },
    });
};

module.exports = {
    connectConsumer,
    disconnectConsumer,
    consumeEmailRequestEvent
};