const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['kafka:29092']
    // brokers: ['localhost:9092']
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
};

const disconnectProducer = async () => {
  await producer.disconnect();
};

const sendUserCreatedEvent = async (userId) => {
  await producer.send({
    topic: 'user-created',
    messages: [{ value: JSON.stringify({ userId }) }],
  });
};

module.exports = {
  connectProducer,
  disconnectProducer,
  sendUserCreatedEvent
};
