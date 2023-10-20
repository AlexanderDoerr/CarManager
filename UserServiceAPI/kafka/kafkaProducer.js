const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['kafka:29092']
    // brokers: ['localhost:9092']
});

const producer = kafka.producer();

const sendUserCreatedEvent = async (userId) => {
    await producer.connect();
    await producer.send({
        topic: 'user-created',
        messages: [{ value: JSON.stringify({ userId }) }],
    });
    await producer.disconnect();
};

module.exports = {
    sendUserCreatedEvent
};