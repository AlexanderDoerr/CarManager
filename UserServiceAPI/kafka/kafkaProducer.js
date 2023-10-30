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

const sendUserCreatedEvent = async (userId) => {
  await producer.send({
    topic: 'user-created',
    messages: [{ value: JSON.stringify({ userId }) }],
  });
};

const sendPasswordResetEmailEvent = async (email, token) => {
  await producer.send({
    topic: 'password-reset-email-request',
    messages: [
      {
        value: JSON.stringify({
          eventType: 'PASSWORD_RESET_EMAIL_REQUEST',
          data: {
            userEmail: email,
            resetToken: token,
          },
        }),
      },
    ],
  });
};


module.exports = {
  connectProducer,
  disconnectProducer,
  sendUserCreatedEvent,
  sendPasswordResetEmailEvent,
};
