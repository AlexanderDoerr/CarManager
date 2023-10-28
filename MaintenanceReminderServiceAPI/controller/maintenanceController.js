const maintenanceModel = require('../data/maintenanceModel.js');
const {consumeInvoiceCreatedEvent} = require('../kafka/kafkaConsumer.js');
const {consumeMileageUpdatedEvent} = require('../kafka/kafkaConsumer.js');
const {consumeCarCreatedEvent} = require('../kafka/kafkaConsumer.js');

const createMaintenanceRecord = async (carId, serviceType, dueDate, dueMileage) => {
    const carRows = await maintenanceModel.getCar(carId);

    if (carRows.length === 0) {
        console.error(`No car found with ID ${carId}. Cannot create reminder.`);
        return;
    }

    const reminder = {
        carId,
        serviceType,
        dueDate,
        dueMileage,
        status: 'pending'
    };
    await maintenanceModel.createMaintenance(reminder);
};

consumeInvoiceCreatedEvent(createMaintenanceRecord);

/****************************************************************************************************/

const createCarRecord = async (userId, carId) => {
    const car = {
        carId,
        userId        
    };

    await maintenanceModel.createCar(car);
};

consumeCarCreatedEvent(createCarRecord);

/****************************************************************************************************/

const getDueMileage = async (carId, mileage, serviceType) => {
    const reminders = await maintenanceModel.getDueMileageMaintenanceReminders(carId, mileage);
    console.log(`Found ${reminders.length} due mileage maintenance reminders.`);
    console.log(reminders);
    console.log(serviceType);
    await updateMaintenanceRecord(reminders, serviceType);
    return reminders;
};

consumeMileageUpdatedEvent(getDueMileage);

const updateMaintenanceRecord = async (reminders, serviceType) => {
    for (const reminder of reminders) {
        if (reminder.serviceType === serviceType) {
            const reminderId = reminder.reminderId;
            const status = 'completed';
            await maintenanceModel.updateMaintenance(reminderId, { status });
        }
    }
};
/****************************************************************************************************/

module.exports = {
    createMaintenanceRecord,
    createCarRecord,
    
};