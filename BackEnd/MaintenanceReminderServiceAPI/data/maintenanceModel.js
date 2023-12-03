const {promiseConnection} = require("./db.js");
const { v4: uuidv4 } = require('uuid');

/*********************************************************************************************************************/

const createMaintenance = async (maintenance) => {
    try {
        console.log(maintenance);
        await promiseConnection.execute(
            'INSERT INTO Reminder (reminderId, carId, serviceType, dueDate, dueMileage, status) VALUES (?, ?, ?, ?, ?, ?)',
            [uuidv4(), maintenance.carId, maintenance.serviceType, maintenance.nextDueDate, maintenance.nextDueMileage, 'pending']
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

/*********************************************************************************************************************/

const getUserByUserId = async (userId) => {
    try {
        const query = 'SELECT * FROM Car WHERE userId = ?';
        const [rows] = await promiseConnection.execute(query, [userId]);
        console.log('User retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving the user: ' + error.message);
    }
};

const getUserCar = async (userId, carId) => {
    try{
        const query = 'SELECT userId FROM Car WHERE userId = ? AND carId = ?';
        const [rows] = await promiseConnection.execute(query, [userId, carId]);
        console.log('User cars retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving the user cars: ' + error.message);
    }
};

const getAllMaintenanceForUser = async (userId) => {
    try {
        const query = 'SELECT Reminder.*, Car.CarID, Car.UserID FROM Car JOIN Reminder ON Car.CarID = Reminder.CarID WHERE Car.UserID = ? AND Reminder.Status = \'pending\'';
        const [rows] = await promiseConnection.execute(query, [userId]);
        console.log('Maintenance reminders retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving maintenance reminders: ' + error.message);
    }
};



const getAllMaintenanceByCarId = async (carId) => {
    try {
        console.log(`Model carId = ${carId}`);
        const query = 'SELECT * FROM Reminder WHERE carId = ?';
        const [rows] = await promiseConnection.execute(query, [carId]);
        console.log('Maintenance reminders retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving maintenance reminders: ' + error.message);
    }
};

const getPendingMaintenanceByCarId = async (carId) => {
    try {
        const query = 'SELECT * FROM Reminder WHERE carId = ? AND status = "pending"';
        const [rows] = await promiseConnection.execute(query, [carId]);
        console.log('Completed maintenance reminders retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving completed maintenance reminders: ' + error.message);
    }
};
 

const getCompletedMaintenanceByCarId = async (carId) => {
    try {
        const query = 'SELECT * FROM Reminder WHERE carId = ? AND status = "completed"';
        const [rows] = await promiseConnection.execute(query, [carId]);
        console.log('Completed maintenance reminders retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving completed maintenance reminders: ' + error.message);
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

// const getDueMileageMaintenanceReminders = async (carId, mileage) => {
//     try {
//         const query = "SELECT * FROM Reminder WHERE carId = ? AND status = 'pending' AND dueMileage <= ?";
//         const [rows] = await promiseConnection.execute(query, [carId, mileage]);
//         console.log('Due mileage maintenance reminders retrieved successfully.');
//         return rows;
//     } catch (error) {
//         console.log(error);
//         throw new Error('An error occurred while retrieving due mileage maintenance reminders: ' + error.message);
//     }
// };

const getDueMileageMaintenanceReminders = async (carId, mileage) => {
    try {
        const query = `
            SELECT Reminder.*, Car.userId
            FROM Reminder
            JOIN Car ON Reminder.carId = Car.carId
            WHERE Reminder.carId = ? AND Reminder.status = 'pending' AND Reminder.dueMileage <= ?`;
        const [rows] = await promiseConnection.execute(query, [carId, mileage]);
        console.log('Due mileage maintenance reminders retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving due mileage maintenance reminders: ' + error.message);
    }
};


const getDailyDueMaintenanceReminders = async () => {
    try {
        const query = "SELECT * FROM Reminder WHERE dueDate <= CURDATE() AND status = 'pending'";
        const [rows] = await promiseConnection.execute(query);
        console.log('Daily due maintenance reminders retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving daily due maintenance reminders: ' + error.message);
    }
};

/*********************************************************************************************************************/


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
        const query = 'SELECT * FROM Car WHERE carId = ?';
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

/*********************************************************************************************************************/

const getServiceTypes = async () => {
    try {
        const query = 'SELECT * FROM ServiceTypes';
        const [rows] = await promiseConnection.execute(query);
        console.log('Service types retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving service types: ' + error.message);
    }
};

/*********************************************************************************************************************/

module.exports = {
    createMaintenance,
    updateMaintenance,
    getAllMaintenanceByCarId,
    getDueMaintenanceReminders,
    deleteMaintenance,
    createCar,
    getCar,
    getDueMileageMaintenanceReminders,
    calculateNextServices,
    getUserByUserId,
    getCompletedMaintenanceByCarId,
    getPendingMaintenanceByCarId,
    getUserCar,
    getDailyDueMaintenanceReminders,
    getServiceTypes,
    getAllMaintenanceForUser
};
