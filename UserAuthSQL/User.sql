-- Drop the database if it exists
DROP DATABASE IF EXISTS userdb;

-- Create the database
CREATE DATABASE userdb;

-- Use the database
USE userdb;

-- Create the user table
CREATE TABLE user 
(
    UserID CHAR(36) PRIMARY KEY,
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
    UserID, FirstName, LastName, DateOfBirth, Email, PhoneNumber, Password, Address, City, State, ZipCode
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
);
