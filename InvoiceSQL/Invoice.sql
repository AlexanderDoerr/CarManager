-- Drop the database if it exists
DROP DATABASE IF EXISTS invoicedb;

-- Create the database
CREATE DATABASE invoicedb;

-- Use the database
USE invoicedb;

CREATE TABLE Invoice (
    InvoiceNumber INT PRIMARY KEY,
    CarId INT NOT NULL,
    ServiceDate DATE NOT NULL,
    ServiceMileage INT NOT NULL,
    MechanicId INT NOT NULL,
    ShopId INT NOT NULL,
    LaborCost INT NOT NULL CHECK (LaborCost >= 0),
    TotalPartsCost INT NOT NULL CHECK (TotalPartsCost >= 0),
    TotalCost INT NOT NULL CHECK (TotalCost >= 0),
    ServiceTypeId INT NOT NULL,
    NextServiceDate DATE,
    NextServiceMileage INT,
    ServiceDescription TEXT,

    -- Constraints
    CHECK (InvoiceNumber >= 0),
    CHECK (CarId >= 0),
    CHECK (ServiceMileage >= 0),
    CHECK (MechanicId >= 0),
    CHECK (ShopId >= 0),
    CHECK (NextServiceDate > ServiceDate OR NextServiceDate IS NULL),
    CHECK (NextServiceMileage > ServiceMileage OR NextServiceMileage IS NULL)
);

-- Parts list associated with an Invoice is a many-to-many relationship.
-- We need an additional table to manage this relationship.

CREATE TABLE Parts (
    PartId INT PRIMARY KEY,
    PartName TEXT NOT NULL,
    PartCost INT NOT NULL CHECK (PartCost >= 0)
);

CREATE TABLE InvoiceParts (
    InvoiceNumber INT,
    PartId INT,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    FOREIGN KEY (InvoiceNumber) REFERENCES Invoice(InvoiceNumber),
    FOREIGN KEY (PartId) REFERENCES Parts(PartId)
);


INSERT INTO Parts (PartId, PartName, PartCost) VALUES
(0, 'Brake Pad', 56),
(1, 'Oil Filter', 176),
(2, 'Spark Plug', 50),
(3, 'Windshield Wiper', 29),
(4, 'Air Filter', 160),
(5, 'Fuel Pump', 94),
(6, 'Battery', 163),
(7, 'Tire', 16),
(8, 'Radiator', 88),
(9, 'Alternator', 191);


INSERT INTO Invoice (InvoiceNumber, CarId, ServiceDate, ServiceMileage, MechanicId, ShopId, LaborCost, TotalPartsCost, TotalCost, ServiceTypeId, NextServiceDate, NextServiceMileage, ServiceDescription) VALUES
(0, 1, '2023-03-17', 19215, 3, 1, 184, 62, 246, 3, '2023-08-13', 20755, 'Service for car 1'),
(1, 3, '2023-08-28', 19886, 3, 1, 151, 285, 436, 3, '2023-12-16', 21784, 'Service for car 3');


INSERT INTO InvoiceParts (InvoiceNumber, PartId, Quantity) VALUES
(0, 0, 4),
(1, 8, 3),
(2, 2, 5);
