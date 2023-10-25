-- Drop the database if it exists
DROP DATABASE IF EXISTS maintenancereminderdb;

-- Create the database
CREATE DATABASE maintenancereminderdb;

-- Use the database
USE maintenancereminderdb;

CREATE TABLE Car
(
    carId CHAR(36) PRIMARY KEY,
    userId CHAR(36),
);

-- Create the Reminder table
CREATE TABLE Reminder
(
    reminderId CHAR(36) PRIMARY KEY,
    carId CHAR(36),
    serviceType VARCHAR(255),
    dueDate DATE,
    dueMileage INT,
    status VARCHAR(50),
    FOREIGN KEY (carId) REFERENCES Car(carId)
);

-- Create the ServiceTypes table
CREATE TABLE ServiceTypes 
(
    serviceType VARCHAR(255) PRIMARY KEY,
    dueTimeMonths INT,
    dueMileage INT
);
-- Insert a new maintenance reminder record
INSERT INTO Reminder 
(
    reminderId, carId, serviceType, dueDate, dueMileage, status
)
VALUES 
(
    UUID(), 
    'car_id_example', 
    'Oil Change', 
    '2023-12-01', 
    5000, 
    'pending'
);

INSERT INTO Car 
(
    carId, userId, otherCarInfo
)
VALUES 
(
    'car_id_example',
    'user_id_example',
    'example info'
);

INSERT INTO ServiceTypes (serviceType, dueTimeMonths, dueMileage)
VALUES
    ('Oil Change', 6, 5000),
    ('Tire Rotation', 6, 7500),
    ('Brake Inspection', 12, 12000),
    ('Air Filter Replacement', 12, 15000),
    ('Transmission Fluid Change', 24, 30000),
    ('Spark Plug Replacement', 36, 45000),
    ('Coolant Flush', 24, 30000),
    ('Battery Replacement', 48, 50000),
    ('Timing Belt Replacement', 60, 75000),
    ('Fuel Filter Replacement', 24, 30000);

