const maintenanceModel = require('../data/maintenanceModel.js');
const {consumeInvoiceCreatedEvent} = require('../kafka/kafkaConsumer.js');
const {consumeMileageUpdatedEvent} = require('../kafka/kafkaConsumer.js');

const createMaintenanceRecord = async (userId, carId, serviceType, dueDate, dueMileage) => {
    const maintenance = {
        carId,
        userId,
        serviceType,
        dueDate,
        dueMileage,
        status: 'pending'
    };
    await maintenanceModel.createMaintenance(maintenance);
};


consumeInvoiceCreatedEvent(createMaintenanceRecord);

module.exports = {
    createMaintenanceRecord,
};