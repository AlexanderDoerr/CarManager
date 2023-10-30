const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'maintenance-reminder-service',
    // brokers: ['localhost:9092']
    brokers: ['kafka:29092']
});

const producer = kafka.producer();

const connectProducer = async () => {
    await producer.connect();
};

const disconnectProducer = async () => {
    await producer.disconnect();
};


const publishMaintenanceReminderCreatedEvent = async (reminderId, carId, userId, serviceType, dueDate, dueMileage) => {
    try {
        await producer.send({
            topic: 'maintenance-reminder-created',
            messages: [
                {
                    value: JSON.stringify({
                        reminderId,
                        carId,
                        userId,
                        serviceType,
                        dueDate,
                        dueMileage,
                    }),
                },
            ],
        });
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
    } finally {
        await producer.disconnect();
        console.log('Producer disconnected');
    }
};



module.exports = {
    publishMaintenanceReminderCreatedEvent,
    connectProducer,
    disconnectProducer
};