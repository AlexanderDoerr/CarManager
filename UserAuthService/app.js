const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db.js');
const sleep = require('sleep-promise');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

// // create the connection to database
// const connection = mysql.createConnection({
//   host: '3306',
//   user: 'user',
//   database: 'test1234'
// });

// simple query
// connection.query(
//   'SELECT * FROM `user`',
//   function(err, results, fields) {
//     console.log(results); // results contains rows returned by server
//     console.log(fields); // fields contains extra meta data about results, if available
//   }
// );

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Waiting for 30 seconds before registering the service to Eureka...');
  await sleep(30000);
  console.log('Registering the service to Eureka...');
//   eurekaClient.start();
});

