const { Kafka } = require('kafkajs');
const sleep = require('sleep-promise');
const db = require('../data/db.js');

const kafka = new Kafka({
  clientId: 'maintenance-reminder-service',
  brokers: ['localhost:9092']
// brokers: ['kafka:29092']
});

const consumer = kafka.consumer({ groupId: 'maintenance-reminder-service-group' });

// const consumeInvoiceCreatedEvent = async (callback) => {
//     console.log('Waiting 10 seconds to connect to Kafka broker...')
//     await sleep(10000);
//     await consumer.connect();
//     await consumer.subscribe({ topic: 'invoice-created', fromBeginning: true});
    
//     await consumer.run({
//         eachMessage: async ({ topic, partition, message }) => {
            
//             const { userId, carId, serviceType, serviceDate, serviceMileage } = JSON.parse(message.value.toString());
//             console.log(`Received message for user: ${userId}, car: ${carId}`);
//             callback(userId, carId, serviceType, serviceDate, serviceMileage);
//         },
//     });
// };

const consumeInvoiceCreatedEvent = async (callback) => {
    console.log('Waiting 10 seconds to connect to Kafka broker...');
    await sleep(10000);
    await consumer.connect();
    await consumer.subscribe({ topic: 'invoice-created', fromBeginning: true });
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { userId, carId, serviceType, serviceDate, serviceMileage } = JSON.parse(message.value.toString());
            console.log(`Received message for user: ${userId}, car: ${carId}, serviceType: ${serviceType}, serviceDate: ${serviceDate}, serviceMileage: ${serviceMileage}`);

            // Query the ServiceTypes table to get the due time and due mileage for the service type
            const [rows] = await db.promise().execute(
                'SELECT dueTimeMonths, dueMileage FROM ServiceTypes WHERE serviceType = ?',
                [serviceType]
            );
            const { dueTimeMonths, dueMileage } = rows[0];

            // Calculate the next due date and due mileage
            const nextDueDate = new Date(serviceDate);
            nextDueDate.setMonth(nextDueDate.getMonth() + dueTimeMonths);
            const nextDueMileage = serviceMileage + dueMileage;

            // Call the callback function with the calculated values
            callback(userId, carId, serviceType, nextDueDate, nextDueMileage);
        },
    });
};


const consumeMileageUpdatedEvent = async (callback) => {
    console.log('Waiting 10 seconds to connect to Kafka broker...')
    await sleep(10000);
    await consumer.connect();
    await consumer.subscribe({ topic: 'mileage-updated', fromBeginning: true});

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            
            const { carId, mileage } = JSON.parse(message.value.toString());
            console.log(`Received message for car: ${carId}`);
            callback(carId, mileage);
        },
    });
};

module.exports = {
    consumeInvoiceCreatedEvent,
    consumeMileageUpdatedEvent
};