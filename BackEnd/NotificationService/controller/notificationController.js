const kafkaProducer = require('../kafka/kafkaProducer.js');
const kafkaConsumer = require('../kafka/kafkaConsumer.js');
const {sendReminderEmail} = require('../email/emailService.js'); 
const {sendPasswordResetEmail} = require('../email/emailService.js');   
const redis = require('redis');
const client = redis.createClient({url: 'redis://localhost:6379'});

/*****************************************************************************************************************/

(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis');

    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
})();

// Event handling
client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('ready', function() {
    console.log('Redis client is ready');
});

client.on('reconnecting', function(info) {
    console.warn(`Redis reconnecting: attempt ${info.attempt}, delay: ${info.delay}`);
});

client.on('error', function(err) {
    console.error(`Redis error: ${err}`);
});

client.on('end', function() {
    console.log('Redis client disconnected');
});

client.on('warning', function(warning) {
    console.warn(`Redis warning: ${warning}`);
});


/*****************************************************************************************************************/

const storeNewReminder = async (reminderId, carId, userId, serviceType, dueDate, dueMileage) => {
    // console.log(`Calling StoreNewReminder Function reminderId: ${reminderId}, car: ${carId}, userId: ${userId}, serviceType: ${serviceType}, dueDate: ${dueDate}, dueMileage: ${dueMileage}`)

    //I am faling here somehow and I don't know why
    try {
        storeReminder(reminderId, carId, userId, serviceType, dueDate, dueMileage)
        .then((result) => {
            console.log(`Result of Redis Store - ${result}`); // This will log the value passed 

          })
          .catch((error) => {
            console.error(error); // This will log any error that occurred during the operation
          });

          console.log(userId, reminderId)
        // await kafkaProducer.sendUserEmailRequestEvent(userId, reminderId);

    } catch (error) {
        console.error(`error in storeNewReminder: ${error}`);
    }
};

kafkaConsumer.consumeReminderEvent(storeNewReminder);

/*****************************************************************************************************************/

const sendReminderDueEmail = async (email, reminderId) => {
    try {
        const reminder = await retrieveReminder(reminderId);

        console.log(`Reminder due email sent to ${email}`)

        await sendReminderEmail('alexdoerr@live.com', 'Reminder Due', reminder.carId, reminder.serviceType, reminder.dueDate, reminder.dueMileage);

        await deleteReminder(reminderId);

        console.log('Reminder email sent successfully');

    } catch (error) {
        console.error(`error in sendReminderEmail: ${error}`);
    }
};

kafkaConsumer.consumeEmailResponseEvent(sendReminderDueEmail);

/*****************************************************************************************************************/

const sendThePasswordResetEmail = async (email, passwordResetToken) => {
    try {
        console.log(`Password reset email sent to ${email}`)
        
        await sendPasswordResetEmail('alexdoerr@live.com', 'Password Reset', passwordResetToken);

        console.log('Password reset email sent successfully');

    } catch (error) {
        console.error(`error in sendPasswordResetEmail: ${error}`);
    }
};

kafkaConsumer.consumePasswordResetEvent(sendThePasswordResetEmail);

/*****************************************************************************************************************/


const retrieveReminder = async (reminderId) => {
    try {
        const reminder = await getData(reminderId);
        return reminder;
    } catch (error) {
        console.error(`error in retrieveReminder: ${error}`);
    }
};

const deleteReminder = async (reminderId) => {
    try {
        await deleteData(reminderId);
    } catch (error) {
        console.error(`error in deleteReminder: ${error}`);
    }
};

/*****************************************************************************************************************/

const storeReminder = (reminderId, carId, userId, serviceType, dueDate, dueMileage) => {
    const key = reminderId;
    const value = { carId, userId, serviceType, dueDate, dueMileage };
    return new Promise((resolve, reject) => {
        client.set(key, JSON.stringify(value), (err, res) => {
          if(err) reject(err);
          else resolve(res);
        });
      });
};

// const storeReminder = (reminderId, carId, userId, serviceType, dueDate, dueMileage) => {
//     console.log(`Calling StoreReminder Function reminderId: ${reminderId}, car: ${carId}, userId: ${userId}, serviceType: ${serviceType}, dueDate: ${dueDate}, dueMileage: ${dueMileage}`)
//     const key = reminderId;
//     const value = { carId, userId, serviceType, dueDate, dueMileage };
//             client.set(key, JSON.stringify(value), (err, res) => {
//           if(err) reject(err);
//           else resolve(res);
//         });
// };

const getData = (reminderId) => {
    const key = reminderId;
    return new Promise((resolve, reject) => {
      client.get(key, (err, data) => {
        if(err) reject(err);
        else resolve(JSON.parse(data));
      });
    });
};

const deleteData = (reminderId) => {
    const key = reminderId;
    return new Promise((resolve, reject) => {
      client.del(key, (err, res) => {
        if(err) reject(err);
        else resolve(res);
      });
    });
};

/*****************************************************************************************************************/

module.exports = {
    storeReminder,
    getData,
    deleteData
};
  