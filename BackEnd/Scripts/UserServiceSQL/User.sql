-- Drop the database if it exists
DROP DATABASE IF EXISTS userdb;

-- Create the database
CREATE DATABASE userdb;

-- Use the database
USE userdb;

-- Create the user table
CREATE TABLE user 
(
    UserId CHAR(36) PRIMARY KEY,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    DateOfBirth DATE,
    Email VARCHAR(255),
    PhoneNumber VARCHAR(20),
    Password VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(255),
    State VARCHAR(2),
    ZipCode INT
);

-- Insert a new user record
INSERT INTO user
(
    UserId, FirstName, LastName, DateOfBirth, Email, PhoneNumber, Password, Address, City, State, ZipCode
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

-- Create password reset tokens table
CREATE TABLE password_reset_tokens
(
    TokenId INT AUTO_INCREMENT PRIMARY KEY,
    Token VARCHAR(255) UNIQUE,
    UserId CHAR(36),
    CreatedAt TIMESTAMP DEFAULT (UTC_TIMESTAMP()),
    FOREIGN KEY (UserId) REFERENCES user(UserId)
);
