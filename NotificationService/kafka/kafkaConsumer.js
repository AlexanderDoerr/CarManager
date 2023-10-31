const { Kafka } = require('kafkajs');
const sleep = require('sleep-promise');

const kafka = new Kafka({
  clientId: 'car-service',
//   brokers: ['localhost:9092']
    brokers: ['kafka:29092']
});



const reminderConsumer = kafka.consumer({ groupId: 'reminder-service-group' });
const passResetConsumer = kafka.consumer({ groupId: 'password-reset-service-group' });


const connectConsumer = async () => {
    await reminderConsumer.connect();
    await passResetConsumer.connect();
};

const disconnectConsumer = async () => {
    await reminderConsumer.disconnect();
    await passResetConsumer.disconnect();
};

const consumeReminderEvent = async (callback) => {

    await reminderConsumer.subscribe({ topic: 'maintenance-reminder-created', fromBeginning: true });
    
    reminderConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { reminderId, carId, userId, serviceType, dueDate, dueMileage } = JSON.parse(message.value.toString());
            console.log(`Received message for reminderId: ${reminderId}, car: ${carId}, userId: ${userId}, serviceType: ${serviceType}, dueDate: ${dueDate}, dueMileage: ${dueMileage}`);
            callback(reminderId, carId, userId, serviceType, dueDate, dueMileage);
        },
    });
};

const consumePasswordResetEvent = async (callback) => {

    await passResetConsumer.subscribe({ topic: 'password-reset-email-request', fromBeginning: true });
    
    passResetConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { userEmail, resetToken } = JSON.parse(message.value.toString());
            console.log(`Received message for userEmail: ${userEmail}, passwordResetToken: ${resetToken}`);
            callback(userEmail, resetToken);
        },
    });
};

const consumeEmailResponseEvent = async (callback) => {
    
    await reminderConsumer.subscribe({ topic: 'email-response', fromBeginning: true });
    
    reminderConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { email, reminderId } = JSON.parse(message.value.toString());
            console.log(`Received message for email: ${email}, reminderId: ${reminderId}`);
            callback(email, reminderId);
        },
    });
};

module.exports = {
    connectConsumer,
    disconnectConsumer,
    consumeReminderEvent,
    consumePasswordResetEvent,
    consumeEmailResponseEvent
};
