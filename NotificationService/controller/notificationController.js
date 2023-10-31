const redisModel = require('../data/notificationModel.js');
const kafkaProducer = require('../kafka/kafkaProducer.js');
const kafkaConsumer = require('../kafka/kafkaConsumer.js');

/*****************************************************************************************************************/

const storeNewReminder = async (reminderId, carId, userId, serviceType, dueDate, dueMileage) => {
    try {
        await redisModel.storeReminder(reminderId, carId, userId, serviceType, dueDate, dueMileage);

        await kafkaProducer.sendUserEmailRequestEvent(userId, reminderId);

        console.log('Reminder stored and email request event sent successfully');

    } catch (error) {
        console.error(`error in storeNewReminder: ${error}`);
    }
};

kafkaConsumer.consumeReminderEvent(storeNewReminder);

/*****************************************************************************************************************/