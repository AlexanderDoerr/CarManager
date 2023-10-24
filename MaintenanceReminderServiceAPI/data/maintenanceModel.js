const db = require("./db.js");
const { v4: uuidv4 } = require('uuid');

/*********************************************************************************************************************/

const createMaintenance = async (maintenance) => {
    try {
        await db.promise().execute(
            'INSERT INTO MaintenanceReminders (reminderId, carId, userId, serviceType, dueDate, dueMileage, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uuidv4(), maintenance.carId, maintenance.userId, maintenance.serviceType, maintenance.dueDate, maintenance.dueMileage, 'pending']
        );
        console.log('Maintenance reminder created successfully.');
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while creating the maintenance reminder: ' + error.message);
    }
};

const updateMaintenance = async (reminderId, updates) => {
    try {
        const query = 'UPDATE MaintenanceReminders SET ? WHERE reminderId = ?';
        const result = await db.promise().execute(query, [updates, reminderId]);
        console.log('Maintenance reminder updated successfully.');
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while updating the maintenance reminder: ' + error.message);
    }
};

const getMaintenanceByCarId = async (carId) => {
    try {
        const query = 'SELECT * FROM MaintenanceReminders WHERE carId = ?';
        const [rows] = await db.promise().execute(query, [carId]);
        console.log('Maintenance reminders retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving maintenance reminders: ' + error.message);
    }
};

const getDueMaintenanceReminders = async () => {
    try {
        const query = 'SELECT * FROM MaintenanceReminders WHERE dueDate <= CURDATE() AND status = \'pending\'';
        const [rows] = await db.promise().execute(query);
        console.log('Due maintenance reminders retrieved successfully.');
        return rows;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving due maintenance reminders: ' + error.message);
    }
};


const deleteMaintenance = async (reminderId) => {
    try {
        const query = 'DELETE FROM MaintenanceReminders WHERE reminderId = ?';
        const result = await db.promise().execute(query, [reminderId]);
        console.log('Maintenance reminder deleted successfully.');
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while deleting the maintenance reminder: ' + error.message);
    }
};

/*********************************************************************************************************************/

module.exports = {
    createMaintenance,
    updateMaintenance,
    getMaintenanceByCarId,
    getDueMaintenanceReminders,
    deleteMaintenance
};
