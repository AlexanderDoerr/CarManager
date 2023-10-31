// userModel.js
const { client } = require('./db.js');

const storeReminder = async (reminderId, carId, userId, serviceType, dueDate, dueMileage) => {
    const reminderObj = { carId, userId, serviceType, dueDate, dueMileage };
    return new Promise((resolve, reject) => {
        client.set(reminderId, JSON.stringify(reminderObj), (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

const getReminder = async (reminderId) => {
    return new Promise((resolve, reject) => {
        client.get(reminderId, (err, reminderData) => {
            if (err) return reject(err);
            const reminderObj = JSON.parse(reminderData);
            resolve(reminderObj);
        });
    });
};

const deleteReminder = async (reminderId) => {
    return new Promise((resolve, reject) => {
        client.del(reminderId, (err, res) => {
            if (err) return reject(err);
            resolve(res);  // res will be 1 if the key existed and was deleted, or 0 otherwise
        });
    });
};

module.exports = {
    storeReminder, 
    getReminder,
    deleteReminder
};
