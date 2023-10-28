const {promiseConnection} = require("./db.js");
const { v4: uuidv4 } = require('uuid');

/*********************************************************************************************************************/

const createMaintenance = async (maintenance) => {
    try {
        await promiseConnection.execute(
            'INSERT INTO Reminder (reminderId, carId, serviceType, dueDate, dueMileage, status) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), maintenance.carId, maintenance.serviceType, maintenance.dueDate, maintenance.dueMileage, 'pending']
        );
        console.log('Maintenance reminder created successfully.');
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while creating the maintenance reminder: ' + error.message);
    }
};

const updateMaintenance = async (reminderId, updates) => {
    try {
        const query = 'UPDATE Reminder SET status = ? WHERE reminderId = ?';
        const result = await promiseConnection.execute(query, [updates.status, reminderId]);
        console.log('Maintenance reminder updated successfully.');
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while updating the maintenance reminder: ' + error.message);
    }
};

const getMaintenanceByCarId = async (carId) => {
    try {
        const query = 'SELECT * FROM Reminder WHERE carId = ?';
        const [rows] = await promiseConnection.execute(query, [carId]);
        console.log('Maintenance reminders retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving maintenance reminders: ' + error.message);
    }
};

const getDueMaintenanceReminders = async (carId) => {
    try {
        const query = "SELECT * FROM Reminder WHERE carId = ? AND dueDate <= CURDATE() AND status = 'pending'";
        const [rows] = await promiseConnection.execute(query, [carId]);
        console.log('Due maintenance reminders retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving due maintenance reminders: ' + error.message);
    }
};

const getDueMileageMaintenanceReminders = async (carId, mileage) => {
    try {
        const query = "SELECT * FROM Reminder WHERE carId = ? AND status = 'pending' AND dueMileage <= ?";
        const [rows] = await promiseConnection.execute(query, [carId, mileage]);
        console.log('Due mileage maintenance reminders retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving due mileage maintenance reminders: ' + error.message);
    }
};


const deleteMaintenance = async (reminderId) => {
    try {
        const query = 'DELETE FROM Reminder WHERE reminderId = ?';
        const result = await promiseConnection.execute(query, [reminderId]);
        console.log('Maintenance reminder deleted successfully.');
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while deleting the maintenance reminder: ' + error.message);
    }
};

/*********************************************************************************************************************/

const createCar = async (car) => {
    try {
        await promiseConnection.execute(
            'INSERT INTO Car (carId, userId) VALUES (?, ?)',
            [car.carId, car.userId]
        );
        console.log('Car created successfully.');
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while creating the car: ' + error.message);
    }
};

const getCar = async (carId) => {
    try {
        const query = 'SELECT carId FROM Car WHERE carId = ?';
        const [rows] = await promiseConnection.execute(query, [carId]);
        
        if (rows.length === 0) {
            console.log(`No car found with ID ${carId}.`);
        } else {
            console.log('Car retrieved successfully.');
        }

        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving the car: ' + error.message);
    }
};

/*********************************************************************************************************************/

const calculateNextServices = async (serviceType, serviceDate, serviceMileage) => {

    const [rows] = await promiseConnection.execute(
        'SELECT dueTimeMonths, dueMileage FROM ServiceTypes WHERE serviceType = ?',
        [serviceType]
    );
    const { dueTimeMonths, dueMileage } = rows[0];

    // Calculate the next due date and due mileage
    const nextDueDate = new Date(serviceDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + dueTimeMonths);
    const nextDueMileage = serviceMileage + dueMileage;

    return {
        nextDueDate, // corrected
        nextDueMileage // corrected
    };
};

module.exports = {
    createMaintenance,
    updateMaintenance,
    getMaintenanceByCarId,
    getDueMaintenanceReminders,
    deleteMaintenance,
    createCar,
    getCar,
    getDueMileageMaintenanceReminders,
    calculateNextServices
};
