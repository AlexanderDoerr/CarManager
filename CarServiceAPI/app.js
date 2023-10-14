require('dotenv').config();
const express = require('express');
const sleep = require('sleep-promise');
const eurekaClient = require('./eurekaConfig.js');
const mongoose = require('mongoose');
const connectDB = require('./data/db.js');
const carRoutes = require('./routes/cars.js');

const app = express();
const PORT = process.env.PORT || 3001;
const EUREKA_DELAY = process.env.EUREKA_DELAY || 30000;

// Middleware
app.use(express.json());
app.use(carRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Handle Unhandled Routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect to MongoDB
connectDB();

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
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected');
    process.exit(0);
  });
});

