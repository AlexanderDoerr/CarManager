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

function connectToDatabase() {
  console.log('Attempting to connect to the database...');
  connection.connect(error => {
      if (error) {
          console.error('An error occurred while connecting to the DB: ', error);
          console.log('Retrying in 10 seconds...');
          setTimeout(connectToDatabase, 10000);  // Retry every 30 seconds
      } else {
          console.log('Connected to the database.');
      }
  });
}

// Initial attempt to connect
connectToDatabase();



module.exports = connection;
