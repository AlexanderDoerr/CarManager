require('dotenv').config();
const express = require('express');
const sleep = require('sleep-promise');
const eurekaClient = require('./eurekaConfig.js');
const userRoutes = require('./routes/users.js');

const app = express();
const PORT = process.env.PORT || 3000;
const EUREKA_DELAY = process.env.EUREKA_DELAY || 30000;

app.use(express.json());
app.use(userRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Handle Unhandled Routes
app.use((req, res) => {
  res.status(404).json({ message: "User Route not found" });
});

// start server
app.listen(PORT, async () => {
  try {
    console.log(`Server running on port ${PORT}`);
    console.log(`Waiting for ${EUREKA_DELAY/1000} seconds before registering the service to Eureka...`);
    await sleep(EUREKA_DELAY);
    console.log('Registering the service to Eureka...');
    eurekaClient.start();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('Gracefully shutting down...');
  eurekaClient.stop();
});

