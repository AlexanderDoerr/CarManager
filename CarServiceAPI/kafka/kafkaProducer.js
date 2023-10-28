const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'car-service',
    brokers: ['localhost:9092']
//   brokers: ['kafka:29092']
  });

const producer = kafka.producer();

const connectProducer = async () => {
    await producer.connect();
};

const disconnectProducer = async () => {
    await producer.disconnect();
};

const publishCarCreatedEvent = async (userId, carId,) => {
    console.log("car created event")
    await producer.send({
        topic: 'car-created',
        messages: [
            {
                value: JSON.stringify({
                    userId,
                    carId
                }),
            },
        ],
    });
};

const publishInvoiceCreatedEvent = async (carId, serviceType, serviceDate, serviceMileage) => {
    console.log("invoice created event")
    console.log(carId, serviceType, serviceDate, serviceMileage)
    await producer.send({
        topic: 'invoice-created',
        messages: [
            {
                value: JSON.stringify({
                    carId,
                    serviceType,
                    serviceDate,
                    serviceMileage
                }),
            },
        ],
    });
};

const publishMileageUpdatedEvent = async (carId, mileage, serviceType) => {
    console.log("mileage updated event")
    console.log(carId, mileage, serviceType)
    await producer.send({
        topic: 'mileage-updated',
        messages: [
            { 
                value: JSON.stringify({
                    carId,
                    mileage,
                    serviceType
                }),
            },
        ],
    });
};

module.exports = {
    publishCarCreatedEvent,
    publishInvoiceCreatedEvent,
    publishMileageUpdatedEvent,
    connectProducer,
    disconnectProducer
};