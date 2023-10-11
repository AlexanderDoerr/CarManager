const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./data/db.js');
const sleep = require('sleep-promise');
const userRoutes = require('./routes/users.js');
const eurekaClient = require('./eurekaConfig.js');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use('/users', userRoutes);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Waiting for 30 seconds before registering the service to Eureka...');
  // await sleep(30000);
  console.log('Registering the service to Eureka...');
  eurekaClient.start();
});

