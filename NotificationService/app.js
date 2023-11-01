require('dotenv').config();
const sleep = require('sleep-promise');
const eurekaClient = require('./eurekaConfig.js');
const db = require('./data/db.js');
const kafkaConsumer = require('./kafka/kafkaConsumer.js');
const kafkaProducer = require('./kafka/kafkaProducer.js');
const emailService = require('./email/emailService.js');    

const SERVER_DELAY = process.env.SERVER_DELAY || 30000;

const run = async () => {
    emailService.sendTestEmail('alexdoerr@live.com', 'Connor is a butt');
    // await sleep(SERVER_DELAY);
    // await eurekaClient.start();
    // await db.connect();
    // await kafkaConsumer.connectConsumer();
    // await kafkaProducer.connectProducer();
};

const shutdown = async () => {
    // await eurekaClient.stop();
    // await db.disconnect();
    // await kafkaConsumer.disconnectConsumer();
    // await kafkaProducer.disconnectProducer();
    process.exit(0);
};

run().catch(error => {
    console.error(error);
    shutdown();
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);