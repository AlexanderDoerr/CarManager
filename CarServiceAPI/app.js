require('dotenv').config();
const express = require('express');
const sleep = require('sleep-promise');
const eurekaClient = require('./eurekaConfig.js');
const mongoose = require('mongoose');
const connectDB = require('./data/db.js');
const carRoutes = require('./routes/cars.js');
const invoiceRoutes = require('./routes/invoices.js');

const app = express();
const PORT = process.env.PORT;
// const PORT = 3001;
const EUREKA_DELAY = process.env.EUREKA_DELAY;

// Middleware
app.use(express.json());
app.use("/car", carRoutes);
app.use("/invoice", invoiceRoutes);

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

