const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'car-service',
    // brokers: ['localhost:9092']
  brokers: ['kafka:29092']
  });

const producer = kafka.producer();

const publishCarCreatedEvent = async (userId, carId,) => {
    await producer.connect();
    await producer.send({
        topic: 'car-created',
        messages: [
            {
                value: JSON.stringify({
                    userId,
                    carId,
                }),
            },
        ],
    });
};

const publishInvoiceCreatedEvent = async (userId, carId, serviceType, serviceDate, serviceMileage) => {
    await producer.connect();
    await producer.send({
        topic: 'invoice-created',
        messages: [
            {
                value: JSON.stringify({
                    userId,
                    carId,
                    serviceType,
                    serviceDate,
                    serviceMileage,
                }),
            },
        ],
    });
};

const publishMileageUpdatedEvent = async (carId, mileage) => {
    await producer.connect();
    await producer.send({
        topic: 'mileage-updated',
        messages: [
            { value: JSON.stringify({ carId, mileage }) }
        ]
    });
}

module.exports = {
    publishCarCreatedEvent,
    publishInvoiceCreatedEvent,
    publishMileageUpdatedEvent,
};