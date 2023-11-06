const { Kafka } = require('kafkajs');
const sleep = require('sleep-promise');
const db = require('../data/db.js');

const kafka = new Kafka({
  clientId: 'maintenance-reminder-service',
//   brokers: ['localhost:9092']
brokers: ['kafka:29092']
});

const carCreatedConsumer = kafka.consumer({ groupId: 'car-created-consumer-group' });
const invoiceCreatedConsumer = kafka.consumer({ groupId: 'invoice-created-consumer-group' });
const mileageUpdatedConsumer = kafka.consumer({ groupId: 'mileage-updated-consumer-group' });

const connectConsumer = async () => {
    await carCreatedConsumer.connect();
    await invoiceCreatedConsumer.connect();
    await mileageUpdatedConsumer.connect();
};

const disconnectConsumer = async () => {
    await carCreatedConsumer.disconnect();
    await invoiceCreatedConsumer.disconnect();
    await mileageUpdatedConsumer.disconnect();
};

const consumeInvoiceCreatedEvent = async (callback) => {

    await invoiceCreatedConsumer.subscribe({ topic: 'invoice-created', fromBeginning: true });
    
    invoiceCreatedConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { carId, serviceType, serviceDate, serviceMileage } = JSON.parse(message.value.toString());
            console.log(`Received message for car: ${carId}, serviceType: ${serviceType}, serviceDate: ${serviceDate}, serviceMileage: ${serviceMileage}`);
            callback(carId, serviceType, serviceDate, serviceMileage);
        },
    });
};


const consumeMileageUpdatedEvent = async (callback) => {

    await mileageUpdatedConsumer.subscribe({ topic: 'mileage-updated', fromBeginning: true});

    mileageUpdatedConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            
            const { carId, mileage, serviceType } = JSON.parse(message.value.toString());
            console.log(`Received message for car: ${carId}, mileage: ${mileage}, serviceType: ${serviceType}`);
            callback(carId, mileage, serviceType);
        },
    });
};

const consumeCarCreatedEvent = async (callback) => {
    
    await carCreatedConsumer.subscribe({ topic: 'car-created', fromBeginning: true });
  
    carCreatedConsumer.run({
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
    consumeCarCreatedEvent, 
    connectConsumer,
    disconnectConsumer
};