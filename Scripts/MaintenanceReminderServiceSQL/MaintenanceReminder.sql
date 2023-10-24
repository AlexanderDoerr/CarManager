-- Drop the database if it exists
DROP DATABASE IF EXISTS maintenancereminderdb;

-- Create the database
CREATE DATABASE maintenancereminderdb;

-- Use the database
USE maintenancereminderdb;

-- Create the MaintenanceReminders table
CREATE TABLE MaintenanceReminders 
(
    reminderId CHAR(36) PRIMARY KEY,
    carId CHAR(36),
    userId CHAR(36),
    serviceType VARCHAR(255),
    dueDate DATE,
    dueMileage INT,
    status VARCHAR(50)
);

-- Insert a new maintenance reminder record
INSERT INTO MaintenanceReminders
(
    reminderId, carId, userId, serviceType, dueDate, dueMileage, status
)
VALUES
(
    UUID(),
    'car_id_example',  -- Replace with a valid carId from your CarService database
    'user_id_example',  -- Replace with a valid userId from your UserService database
    'Oil Change',
    '2023-12-01',
    5000,
    'pending'
);
