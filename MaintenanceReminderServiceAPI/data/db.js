require('dotenv').config();
const mysql = require('mysql2');

// Create a connection to the database
// const connection = mysql.createConnection({
//   // host: 'localhost', // or the IP address of your docker host
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

const connection = mysql.createConnection({// run this when not using docker
  host: 'localhost',
  port: 3307,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const promiseConnection = connection.promise();

const connectToDatabase = () => {
  connection.connect(error => {
      if (error) {
          console.error('An error occurred while connecting to the DB: ', error);
      } else {
          console.log('Connected to the database.');
      }
  });
};

const disconnectFromDatabase = () => {
  connection.end(error => {
    if (error) {
      console.error('An error occurred while disconnecting from the DB: ', error);
    } else {
      console.log('Disconnected from the database.');
    }
  });
};





module.exports = {
  promiseConnection,
  connectToDatabase,
  disconnectFromDatabase
};

