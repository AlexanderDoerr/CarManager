require('dotenv').config();
const express = require('express');
const sleep = require('sleep-promise');
const eurekaClient = require('./eurekaConfig.js');
const kafkaConsumer = require('./kafka/kafkaConsumer.js');
const kafkaProducer = require('./kafka/kafkaProducer.js');
require('./controller/notificationController.js');

  

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_DELAY = process.env.SERVER_DELAY || 30000;

app.use(express.json());


const server = app.listen(PORT, async () => {
    try {
      console.log(`Server running on port ${PORT}`);
      console.log(`Waiting for ${SERVER_DELAY/1000} seconds before registering services`);
    //   await sleep(SERVER_DELAY);
  
      console.log('Registering the service to Eureka...');
      eurekaClient.start();  

      await kafkaConsumer.connectConsumer();
        console.log('Connected to Kafka consumer');
      await kafkaProducer.connectProducer();
      console.log('Connected to Kafka producer');
      
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });
  
  /***********************************************************************************************/
  
  const gracefulShutdown = () => {
    console.log('\nStarting graceful shutdown...');
  
    // Prevent new operations
    server.close(async () => {
      console.log('Closed out remaining connections.');
  
      // Disconnect from Kafka producer
      
      console.log('Disconnected from Kafka producer');
      await kafkaProducer.disconnectProducer();

        // Disconnect from Kafka consumer
        await kafkaConsumer.disconnectConsumer();

  
      // Stop Eureka client
      await eurekaClient.stop();
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

// const run = async () => {    
//     await sleep(SERVER_DELAY);
//     await eurekaClient.start();
//     await kafkaConsumer.connectConsumer();
//     await kafkaProducer.connectProducer();
// };

// const shutdown = async () => {
//     await eurekaClient.stop();
//     await kafkaConsumer.disconnectConsumer();
//     await kafkaProducer.disconnectProducer();
//     process.exit(0);
// };

// run().catch(error => {
//     console.error(error);
//     shutdown();
// });

// process.on('SIGINT', shutdown);
// process.on('SIGTERM', shutdown);