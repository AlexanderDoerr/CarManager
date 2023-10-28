const { Kafka } = require('kafkajs');
const sleep = require('sleep-promise');
const db = require('../data/db.js');

const kafka = new Kafka({
  clientId: 'maintenance-reminder-service',
  brokers: ['localhost:9092']
// brokers: ['kafka:29092']
});

const carCreatedConsumer = kafka.consumer({ groupId: 'car-created-consumer-group' });
const invoiceCreatedConsumer = kafka.consumer({ groupId: 'invoice-created-consumer-group' });
const mileageUpdatedConsumer = kafka.consumer({ groupId: 'mileage-updated-consumer-group' });


const consumeInvoiceCreatedEvent = async (callback) => {
    console.log('consumeInvoiceCreatedEvent Waiting 10 seconds to connect to Kafka broker...');
    await sleep(10000);
    await invoiceCreatedConsumer.connect();
    await invoiceCreatedConsumer.subscribe({ topic: 'invoice-created', fromBeginning: true });
    
    await invoiceCreatedConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { carId, serviceType, serviceDate, serviceMileage } = JSON.parse(message.value.toString());
            console.log(`Received message for car: ${carId}, serviceType: ${serviceType}, serviceDate: ${serviceDate}, serviceMileage: ${serviceMileage}`);

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
            callback(carId, serviceType, nextDueDate, nextDueMileage);
        },
    });
};


const consumeMileageUpdatedEvent = async (callback) => {
    console.log('consumeMileageUpdatedEvent Waiting 10 seconds to connect to Kafka broker...')
    await sleep(10000);
    await mileageUpdatedConsumer.connect();
    await mileageUpdatedConsumer.subscribe({ topic: 'mileage-updated', fromBeginning: true});

    await mileageUpdatedConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            
            const { carId, mileage, serviceType } = JSON.parse(message.value.toString());
            console.log(`Received message for car: ${carId}, mileage: ${mileage}, serviceType: ${serviceType}`);
            callback(carId, mileage, serviceType);
        },
    });
};

const consumeCarCreatedEvent = async (callback) => {
    console.log('consumeCarCreatedEvent Waiting 10 seconds to connect to Kafka broker...')
    await sleep(10000);
    await carCreatedConsumer.connect();
    await carCreatedConsumer.subscribe({ topic: 'car-created', fromBeginning: true });
  
    await carCreatedConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { userId, carId } = JSON.parse(message.value.toString());
        console.log(`Received message for car: ${carId}, user: ${userId}`);
        callback(userId, carId);
      },
    });
  };

module.exports = {
    consumeInvoiceCreatedEvent,
    consumeMileageUpdatedEvent,
    consumeCarCreatedEvent
};