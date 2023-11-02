const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service',
  // brokers: ['kafka:29092']
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
};

const disconnectProducer = async () => {
  await producer.disconnect();
};

const sendUserEmailRequestEvent = async(userId, reminderId) => {
    await producer.send({
        topic: 'user-email-request',
        messages: [
        { value: JSON.stringify({ userId, reminderId }) },
        ],
    });
};

module.exports = {
    connectProducer,
    disconnectProducer,
    sendUserEmailRequestEvent,
};