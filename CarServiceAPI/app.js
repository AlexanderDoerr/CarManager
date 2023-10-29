require('dotenv').config();
const express = require('express');
const sleep = require('sleep-promise');
const eurekaClient = require('./eurekaConfig.js');
const carRoutes = require('./routes/cars.js');
const invoiceRoutes = require('./routes/invoices.js');
const {connectDB, disconnectDB} = require('./data/db.js');
const { connectProducer, disconnectProducer } = require('./kafka/kafkaProducer.js');
const { connectConsumer, disconnectConsumer } = require('./kafka/kafkaConsumer.js');

const app = express();
const PORT = process.env.PORT;
const SERVER_DELAY = process.env.SERVER_DELAY;

// Middleware
app.use(express.json());
app.use("/car", carRoutes);
app.use("/invoice", invoiceRoutes);

/***********************************************************************************************/

const server = app.listen(PORT, async () => {
  try{
    console.log(`Server running on port ${PORT}`);
    console.log(`Waiting for ${SERVER_DELAY/1000} seconds before registering services`);
    await sleep(SERVER_DELAY);

    console.log('Registering the service to Eureka...');
    eurekaClient.start();

    await connectDB();

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
    await disconnectDB();

    // Stop Eureka client
    eurekaClient.stop();
    console.log('Stopped Eureka client');

    process.exit();
  });

  setTimeout(() => {
    console.log('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

/***********************************************************************************************/

