# CarManager
Capstone


To stop the services defined in your docker-compose.yml file without destroying the containers, use:
docker-compose stop

To start the services again, use:
docker-compose start

To destroy the services (which destroys the containers but not the volumes), use:
docker-compose down

To destroy the services and volumes, use:
docker-compose down -v

<!-- USE MASTER
GO

DROP DATABASE IF EXISTS UserAuthentication
GO

CREATE DATABASE UserAuthentication;
GO

USE UserAuthentication;
GO

-- Create the user table
CREATE TABLE [User] 
(
	UserID INT IDENTITY(1,1) PRIMARY KEY,
	FirstName VARCHAR(255),
    LastName VARCHAR(255),
    DateOfBirth DATE,
    Email VARCHAR(255),
    PhoneNumber INT,
    Password VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(255),
    State VARCHAR(2),
    ZipCode INT
)
GO

-- Insert a new user record
INSERT INTO [User]
(
    FirstName, LastName, DateOfBirth, Email, PhoneNumber, Password, Address, City, State, ZipCode
)
VALUES
(
    'John',
    'Doe',
    '1990-01-01',
    'john.doe@example.com',
    1234567890,
    'password123',
    '123 Main St',
    'Springfield',
    'IL',
    62704
);
GO -->

<!-- //////////////////////////////////////////////////////////// -->
<!-- MySQL -->
<!-- -- Drop the database if it exists
DROP DATABASE IF EXISTS userdb;

-- Create the database
CREATE DATABASE userdb;

-- Use the database
USE userdb;

-- Create the user table
CREATE TABLE user 
(
    user_id CHAR(36) PRIMARY KEY,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    DateOfBirth DATE,
    Email VARCHAR(255),
    PhoneNumber INT,
    Password VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(255),
    State VARCHAR(2),
    ZipCode INT
);

-- Insert a new user record
INSERT INTO user
(
    user_id, FirstName, LastName, DateOfBirth, Email, PhoneNumber, Password, Address, City, State, ZipCode
)
VALUES
(
    UUID(),
    'John',
    'Doe',
    '1990-01-01',
    'john.doe@example.com',
    1234567890,
    'password123',
    '123 Main St',
    'Springfield',
    'IL',
    62704
); -->
