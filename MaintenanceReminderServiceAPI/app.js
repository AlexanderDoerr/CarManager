require('dotenv').config();
const express = require('express');
const sleep = require('sleep-promise');
const eurekaClient = require('./eurekaConfig.js');

const app = express();
// const PORT = process.env.PORT;
const PORT = 3005;
const EUREKA_DELAY = process.env.EUREKA_DELAY;

app.use(express.json());

app.listen(PORT, async () => {
    try {
      console.log(`Server running on port ${PORT}`);
      console.log(`Waiting for ${EUREKA_DELAY} seconds before registering the service to Eureka...`);
      await sleep(EUREKA_DELAY);
      console.log('Registering the service to Eureka...');
      eurekaClient.start();
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });
  
  process.on('SIGINT', () => {
    console.log('Gracefully shutting down...');
    eurekaClient.stop();
  });
