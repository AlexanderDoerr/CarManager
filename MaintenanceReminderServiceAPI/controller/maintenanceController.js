const maintenanceModel = require('../data/maintenanceModel.js');
const {consumeInvoiceCreatedEvent} = require('../kafka/kafkaConsumer.js');
const {consumeMileageUpdatedEvent} = require('../kafka/kafkaConsumer.js');
const {consumeCarCreatedEvent} = require('../kafka/kafkaConsumer.js');

const createMaintenanceRecord = async (userId, carId, serviceType, dueDate, dueMileage) => {
    const [carRows] = await maintenanceModel.getCar(carId);

    if (carRows.length === 0) {
        console.error(`No car found with ID ${carId}. Cannot create reminder.`);
        return;
    }

    const reminder = {
        carId,
        userId,
        serviceType,
        dueDate,
        dueMileage,
        status: 'pending'
    };
    await maintenanceModel.createMaintenance(reminder);
};

consumeInvoiceCreatedEvent(createMaintenanceRecord);

/****************************************************************************************************/

const createCarRecord = async (userId, cardId) => {
    const car = {
        carId,
        userId        
    };

    await maintenanceModel.createCar(car);
};

consumeCarCreatedEvent(createCarRecord);

module.exports = {
    createMaintenanceRecord,
    
};