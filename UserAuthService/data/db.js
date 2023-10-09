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

const createUser = () => {
  connection.execute(
    'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
    ['Rick C-137', 53],

    function(err, results, fields) {
      console.log(results);  // results contains rows returned by server
      console.log(fields);  // fields contains extra meta data about results, if available
    }
  );
};

// SQL query string
const query = 'INSERT INTO users (UserId, FirstName, LastName, DateOfBirth, Email, PhoneNumber, Password, Address, City, State, ZipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

// Execute query
connection.execute(
  query,
  [userData.UserId, userData.FirstName, userData.LastName, userData.DateOfBirth, userData.Email, userData.PhoneNumber, userData.Password, userData.Address, userData.City, userData.State, userData.ZipCode],
  (err, results, fields) => {
    if(err) throw err;
    console.log('Inserted Row ID:', results.insertId);
  }
);







module.exports = connection;
