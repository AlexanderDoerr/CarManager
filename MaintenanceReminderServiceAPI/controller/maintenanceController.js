const maintenanceModel = require('../data/maintenanceModel.js');
const {consumeInvoiceCreatedEvent} = require('../kafka/kafkaConsumer.js');
const {consumeMileageUpdatedEvent} = require('../kafka/kafkaConsumer.js');
const {consumeCarCreatedEvent} = require('../kafka/kafkaConsumer.js');

/****************************************************************************************************/

const createMaintenanceRecord = async (carId, serviceType, serviceDate, serviceMileage) => {
    const carRows = await maintenanceModel.getCar(carId);

    if (carRows.length === 0) {
        console.error(`No car found with ID ${carId}. Cannot create reminder.`);
        return;
    };

    const calculateServices = await maintenanceModel.calculateNextServices(serviceType, serviceDate, serviceMileage);
    let nextDueDate = calculateServices.nextDueDate;
    let nextDueMileage = calculateServices.nextDueMileage;

    const reminder = {
        carId,
        serviceType,
        nextDueDate,
        nextDueMileage,
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

const getAllRemindersByCarId = async (req, res) => {
    try{
        const userId = req.user.id
        const carId = req.params.carId;

        // Check if user exists and owns the car
        if (user.length === 0 || car[0].userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const reminders = await maintenanceModel.getAllMaintenanceByCarId(carId);

        if (reminders.length === 0) {
            return res.status(404).json({ message: 'No maintenance reminders found' });
        };

        res.status(200).json(reminders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving the maintenance reminders' });
    }
};

const getPendingRemindersByCarId = async (req, res) => {
    try {
        const userId = req.user.id
        const carId = req.params.carId;

        // Check if user exists and owns the car
        if (user.length === 0 || car[0].userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const reminders = await maintenanceModel.getPendingMaintenanceByCarId(carId);

        if (reminders.length === 0) {
            return res.status(404).json({ message: 'No maintenance reminders found' });
        };

        res.status(200).json(reminders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving the maintenance reminders' });
    }
};

const getCompletedRemindersByCarId = async (req, res) => {
    try {
        const userId = req.user.id
        const carId = req.params.carId;

        const user = await maintenanceModel.getUserByUserId(userId);
        const car = await maintenanceModel.getCar(carId);

        // Check if user exists and owns the car
        if (user.length === 0 || car[0].userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const reminders = await maintenanceModel.getCompletedMaintenanceByCarId(carId);

        if (reminders.length === 0) {
            return res.status(404).json({ message: 'No completed maintenance reminders found' });
        };

        res.status(200).json(reminders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving the completed maintenance reminders' });
    }
};

/****************************************************************************************************/


module.exports = {
    createMaintenanceRecord,
    createCarRecord,
    getDueMileage,
    getAllRemindersByCarId,
    getPendingRemindersByCarId,
    getCompletedRemindersByCarId, 
};