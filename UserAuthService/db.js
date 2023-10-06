const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost', // or the IP address of your docker host
  port: 3306,
  user: 'user',
  password: 'test1234',
  database: 'userdb'
});

// Connect to the database
connection.connect(error => {
  if (error) {
    console.error('An error occurred while connecting to the DB: ', error);
    process.exit();
  }
  console.log('Connected to the database.');
});

module.exports = connection;
