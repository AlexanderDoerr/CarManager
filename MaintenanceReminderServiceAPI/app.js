require('dotenv').config();
const express = require('express');
const sleep = require('sleep-promise');
const eurekaClient = require('./eurekaConfig.js');
const controller = require('./controller/maintenanceController.js');
const { connectToDatabase, disconnectFromDatabase } = require('./data/db.js');
const { connectProducer, disconnectProducer } = require('./kafka/kafkaProducer.js');
const { connectConsumer, disconnectConsumer } = require('./kafka/kafkaConsumer.js');

const app = express();
// const PORT = process.env.PORT;
const PORT = 3004;
const SERVER_DELAY = process.env.SERVER_DELAY;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/***********************************************************************************************/

const server = app.listen(PORT, async () => {
  try {
    console.log(`Server running on port ${PORT}`);
    console.log(`Waiting for ${SERVER_DELAY} seconds before registering the service to Eureka...`);
    await sleep(SERVER_DELAY);

    console.log('Registering the service to Eureka...');
    eurekaClient.start();

    connectToDatabase();

    await connectProducer();
    console.log('Connected to Kafka producer');
    await connectConsumer();
    console.log('Connected to Kafka consumer');

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
});

/***********************************************************************************************/

const gracefulShutdown = () => {
  console.log('\nStarting graceful shutdown...');

  // Prevent new operations
  server.close(async () => {
    console.log('Closing out remaining connections.');

    // Disconnect from Kafka producer
    await disconnectProducer();
    console.log('Disconnected from Kafka producer');

    // Disconnect from Kafka consumer
    await disconnectConsumer();
    console.log('Disconnected from Kafka consumer');

    // Disconnect from database
    disconnectFromDatabase();

    // Deregister from Eureka
    eurekaClient.stop();

    console.log('Exiting process.');
    process.exit();
  });
};


process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

/***********************************************************************************************/