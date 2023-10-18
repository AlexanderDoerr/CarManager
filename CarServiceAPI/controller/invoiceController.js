const jwt = require('jsonwebtoken');
const { consumeInvoiceCreatedEvent  } = require('../kafka/kafkaConsumer');
const { Invoice } = require('../data/carModel.js'); // Assuming you have a separate model for invoices
const { UserCars } = require('../data/carModel');

const AddInvoice = async (req, res) => {
    try {
        const userId = req.user.id;
        const carId = req.body.carId; // Assuming you're providing the CarId in the request body
        const invoiceData = req.body.invoice; // The actual invoice data

        console.log(`Received invoice data: ${JSON.stringify(invoiceData)}`);
        console.log(`Received carId: ${carId}`);
        console.log(`Received userId: ${userId}`);

        invoiceData.CarId = carId; // Add the carId to the invoice data

        // Find the UserCars document by userId
        const userCarsDocument = await UserCars.findById(userId);
        if (!userCarsDocument) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the car to which the invoice will be added
        const car = userCarsDocument.cars.find(car => car.CarId === carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Create the invoice in the Invoice collection
        const newInvoice = new Invoice(invoiceData);
        await newInvoice.save();

        // Append the new invoice's ObjectId to the car's Invoices array
        car.Invoices.push(newInvoice._id);
        
        // Save the updated UserCars document
        await userCarsDocument.save();

        // Return the newly created invoice
        res.status(201).json(newInvoice);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while adding the invoice' });
    }
};

module.exports = {
    AddInvoice,
    //... other exported methods
};
