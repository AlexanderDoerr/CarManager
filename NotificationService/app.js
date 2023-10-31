require('dotenv').config();
const sleep = require('sleep-promise');
const eurekaClient = require('./eurekaConfig.js');
const db = require('./data/db.js');
const kafkaConsumer = require('./kafka/kafkaConsumer.js');
const kafkaProducer = require('./kafka/kafkaProducer.js');

const SERVER_DELAY = process.env.SERVER_DELAY || 30000;

const run = async () => {
    await sleep(SERVER_DELAY);
    await eurekaClient.start();
    await db.connect();
    await kafkaConsumer.connectConsumer();
    await kafkaProducer.connectProducer();
};

const shutdown = async () => {
    await eurekaClient.stop();
    await db.disconnect();
    await kafkaConsumer.disconnectConsumer();
    await kafkaProducer.disconnectProducer();
    process.exit(0);
};

run().catch(error => {
    console.error(error);
    shutdown();
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);