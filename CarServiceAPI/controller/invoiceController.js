const { publishMileageUpdatedEvent } = require('../kafka/kafkaProducer');
const { publishInvoiceCreatedEvent } = require('../kafka/kafkaProducer');
const { Invoice } = require('../data/carModel.js'); 
const { UserCars } = require('../data/carModel');

//////////////////////////////////////////////////////////////////////////////////////////

const AddInvoice = async (req, res) => {
    try {
        const userId = req.user.id;
        const carId = req.body.carId; 
        const invoiceData = req.body.invoice; 

        const userCarsDocument = await findUserCarsDocument(userId);
        const car = findCar(userCarsDocument, carId);

        const newInvoice = await createAndSaveInvoice(invoiceData, carId);
        car.Invoices.push(newInvoice._id);

        const publishMileageEvent = updateCarMileage(car, invoiceData);
        await saveUserCarsDocument(userCarsDocument);

        publishMileageEventIfNecessary(publishMileageEvent, carId, invoiceData.ServiceMileage);

        await publishInvoiceCreatedEvent(
            userId,
            carId,
            invoiceData.ServiceType,
            invoiceData.ServiceDate,
            invoiceData.ServiceMileage,
        );

        res.status(201).json(newInvoice);

    } catch (error) {
        handleAddInvoiceError(error, res);
    }
};

const findUserCarsDocument = async (userId) => {
    const userCarsDocument = await UserCars.findById(userId);
    if (!userCarsDocument) {
        throw new Error('User not found');
    }
    return userCarsDocument;
};

const findCar = (userCarsDocument, carId) => {
    const car = userCarsDocument.cars.find(car => car.CarId === carId);
    if (!car) {
        throw new Error('Car not found');
    }
    return car;
};

const createAndSaveInvoice = async (invoiceData, carId) => {
    invoiceData.CarId = carId;
    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();
    return newInvoice;
};

const updateCarMileage = (car, invoiceData) => {
    let publishMileageEvent = false;
    if (invoiceData.ServiceMileage > car.Mileage) {
        car.Mileage = invoiceData.ServiceMileage;
        publishMileageEvent = true;
    } 
    return publishMileageEvent;
};

const saveUserCarsDocument = async (userCarsDocument) => {
    await userCarsDocument.save();
};

const publishMileageEventIfNecessary = (publishMileageEvent, carId, mileage) => {
    if (publishMileageEvent) {
        publishMileageUpdatedEvent(carId, mileage);
    }
};

const handleAddInvoiceError = (error, res) => {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding the invoice',
                           error: error.message });
};


//////////////////////////////////////////////////////////////////////////////////////////

const findInvoice = async (req, res) => {
    try {
        const invoiceId = req.params.invoiceId;
        validateInvoiceId(invoiceId);

        const invoice = await findAndValidateInvoice(invoiceId);
        res.status(200).json(invoice);

    } catch (error) {
        handleFindInvoiceError(error, res);
    }
};

const validateInvoiceId = (invoiceId) => {
    if (!invoiceId) {
        throw new Error('Invoice ID is required');
    }
};

const findAndValidateInvoice = async (invoiceId) => {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    return invoice;
};

const handleFindInvoiceError = (error, res) => {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while finding the invoice',
                           error: error.message });
};

//////////////////////////////////////////////////////////////////////////////////////////

const getCarInvoices = async (req, res) => {
    try {
        const carId = req.params.carId;
        validateCarId(carId);

        const invoices = await findInvoicesByCarId(carId);
        res.status(200).json(invoices);

    } catch (error) {
        handleGetCarInvoicesError(error, res);
    }
};

const validateCarId = (carId) => {
    if (!carId) {
        throw new Error('Car ID is required');
    }
};

const findInvoicesByCarId = async (carId) => {
    const invoices = await Invoice.find({ CarId: carId });
    if (invoices.length === 0) {
        throw new Error('No invoices found for the car');
    }
    return invoices;
};


const handleGetCarInvoicesError = (error, res) => {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching invoices for the car',
                           error: error.message });
};

//////////////////////////////////////////////////////////////////////////////////////////

const getInvoicesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate, carId } = req.body;
        validateDateRangeInput(startDate, endDate, carId);

        const invoices = await findInvoicesByDateRange(startDate, endDate, carId);
        res.status(200).json(invoices);

    } catch (error) {
        handleInvoiceDateRangeError(error, res);
    }
};

const validateDateRangeInput = (startDate, endDate, carId) => {
    if (!startDate || !endDate || !carId) {
        throw new Error('Start date, end date, and carId are required');
    }
};

const findInvoicesByDateRange = async (startDate, endDate, carId) => {
    const invoices = await Invoice.find({
        CarId: carId,
        ServiceDate: { $gte: startDate, $lte: endDate },
    });
    if (invoices.length === 0) {
        throw new Error('No invoices found for the date range');
    }
    return invoices;
};

const handleInvoiceDateRangeError = (error, res) => {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching invoices by date range',
                           error: error.message });
};

//////////////////////////////////////////////////////////////////////////////////////////

const getInvoicesByServiceType = async (req, res) => {
    try {
        const serviceType = req.body.serviceType;
        const carId = req.body.carId;
        validateServiceTypeInput(serviceType, carId);

        const invoices = await findInvoicesByServiceType(serviceType, carId);
        res.status(200).json(invoices);

    } catch (error) {
        handleInvoiceServiceTypeError(error, res);
    }
};

const validateServiceTypeInput = (serviceType, carId) => {
    if (!serviceType || !carId) {
        throw new Error('Service type and carId are required');
    }
};

const findInvoicesByServiceType = async (serviceType, carId) => {
    const invoices = await Invoice.find({ 
        CarId: carId,
        ServiceTypeId: serviceType 
    });
    if (invoices.length === 0) {
        throw new Error('No invoices found for the service type');
    }
    return invoices;
};

const handleInvoiceServiceTypeError = (error, res) => {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching invoices by service type',
                           error: error.message });
};

//////////////////////////////////////////////////////////////////////////////////////////


module.exports = {
    AddInvoice,
    findInvoice,
    getCarInvoices,
    getInvoicesByDateRange,
    getInvoicesByServiceType
};
