require('dotenv').config();
const express = require('express');
const sleep = require('sleep-promise');
const eurekaClient = require('./eurekaConfig.js');
const userRoutes = require('./routes/users.js');
const passwordResetRoutes = require('./routes/passwordReset.js');
const { connectToDatabase, disconnectFromDatabase } = require('./data/db.js');
const { connectProducer, disconnectProducer } = require('./kafka/kafkaProducer.js'); 


const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_DELAY = process.env.SERVER_DELAY || 30000;

app.use(express.json());
app.use("/reset", passwordResetRoutes);
app.use("/user", userRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use((req, res) => {
  res.status(404).json({ message: "User Route not found" });
});

/***********************************************************************************************/

const server = app.listen(PORT, async () => {
  try {
    console.log(`Server running on port ${PORT}`);
    console.log(`Waiting for ${SERVER_DELAY/1000} seconds before registering services`);
    // await sleep(SERVER_DELAY);

    console.log('Registering the service to Eureka...');
    eurekaClient.start();

    connectToDatabase();
    
    await connectProducer();
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
    await disconnectProducer();
    console.log('Disconnected from Kafka producer');

      // Disconnect from database
      disconnectFromDatabase();

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

