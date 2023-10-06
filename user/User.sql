USE MASTER
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
GO