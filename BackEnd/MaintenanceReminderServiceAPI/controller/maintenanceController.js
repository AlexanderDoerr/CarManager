const schedule = require('node-schedule');
const maintenanceModel = require('../data/maintenanceModel.js');
const {consumeInvoiceCreatedEvent} = require('../kafka/kafkaConsumer.js');
const {consumeMileageUpdatedEvent} = require('../kafka/kafkaConsumer.js');
const {consumeCarCreatedEvent} = require('../kafka/kafkaConsumer.js');
const {publishMaintenanceReminderCreatedEvent} = require('../kafka/kafkaProducer.js');

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
    await updateMaintenanceRecord(reminders);
    return reminders;
};

consumeMileageUpdatedEvent(getDueMileage);

const updateMaintenanceRecord = async (reminders) => {
    for (const reminder of reminders) {
        const reminderId = reminder.reminderId;
        const status = 'completed';
        await maintenanceModel.updateMaintenance(reminderId, { status });

        // Assuming you have necessary info for these parameters
        const carId = reminder.carId;
        const userId = reminder.userId;
        const serviceType = reminder.serviceType;
        const dueDate = reminder.dueDate;
        const dueMileage = reminder.dueMileage;

        // Call the producer to send a reminder created event
        await publishMaintenanceReminderCreatedEvent(reminderId, carId, userId, serviceType, dueDate, dueMileage);
    }
};

/****************************************************************************************************/

const dailyJob = async () => { 
    schedule.scheduleJob('0 0 * * *', async () => {
        try {
            console.log('Running daily job...');
            const reminders = await maintenanceModel.getDailyDueMaintenanceReminders();
            console.log(`Found ${reminders.length} pending maintenance reminders.`);
            console.log(reminders);
            await updateMaintenanceRecord(reminders);
        } catch (error) {
            console.error('Error in daily job:', error);
        }
    });
};


/****************************************************************************************************/

const getAllRemindersByCarId = async (req, res) => {
    try{
        const userId = req.user.id
        const carId = req.params.carId;

        const user = await maintenanceModel.getUserCar(userId, carId);

        // Check if user exists and owns the car
        if (!req.user || user[0].userId !== userId) {
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
        const user = await maintenanceModel.getUserCar(userId, carId);

        // Check if user exists and owns the car
        if (!req.user || user[0].userId !== userId) {
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

        const user = await maintenanceModel.getUserCar(userId, carId);

        // Check if user exists and owns the car
        if (!req.user || user[0].userId !== userId) {
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
    dailyJob
};