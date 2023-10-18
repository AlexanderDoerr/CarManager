const { UserCars } = require('../data/carModel');
const jwt = require('jsonwebtoken');
const { consumeUserCreatedEvent  } = require('../kafka/kafkaConsumer');

const VIN_EXISTS_ERROR = 'Car with the provided VIN already exists';
const LICENSE_EXISTS_ERROR = 'Car with the provided License Plate Number already exists';

/************************************************************************************************************/

const processUserId = async (userId) => {
    // Create a new UserCars document with the userId and an empty cars array
    const userCarsDocument = new UserCars({
        _id: userId,
        cars: []
    });

    try {
        await userCarsDocument.save();
        console.log(`UserCars document created for userId: ${userId}`);
    } catch (error) {
        console.error(`Error creating UserCars document for userId: ${userId}`, error);
    }
};

consumeUserCreatedEvent(processUserId);

/************************************************************************************************************/

const validateCar = async (userId, carData) => {
    const userCarsDocument = await UserCars.findById(userId);

    if (!userCarsDocument) {
        throw new Error('User not found');
    }

    const existingCarWithVIN = userCarsDocument.cars.find(car => car.VIN === carData.VIN);
    if (existingCarWithVIN) {
        throw new Error(VIN_EXISTS_ERROR);
    }

    const existingCarWithLicense = userCarsDocument.cars.find(car => car.LicensePlateNumber === carData.LicensePlateNumber);
    if (existingCarWithLicense) {
        throw new Error(LICENSE_EXISTS_ERROR);
    }
};


const addCarToUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const carData = req.body;

        await validateCar(userId, carData);

        // Add the new car to the cars array and save
        const userCarsDocument = await UserCars.findById(userId);
        userCarsDocument.cars.push(carData);
        await userCarsDocument.save();

        res.status(201).json(userCarsDocument);

    } catch (error) {
        console.error(error);
        if ([VIN_EXISTS_ERROR, LICENSE_EXISTS_ERROR].includes(error.message)) {
            res.status(409).json({message: error.message}); // Use HTTP status code 409 for "Conflict"
        } else {
            res.status(500).json({message: 'An error occurred while adding the car'});
        }
    }
};

/************************************************************************************************************/

const getUserCar = async (req, res) => {
    try {
        const userId = req.user.id;
        const carId = req.params.id;

        // Find the UserCars document by userId
        const userCars = await UserCars.findById(userId);

        if (!userCars) {
            return res.status(404).json({message: 'User not found'});
        }

        // Find the car within the cars array by CarId
        const car = userCars.cars.find(car => car.CarId === carId);

        if (car) {
            res.status(200).json(car);
        } else {
            res.status(404).json({message: 'getUserCar not found'});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'An error occurred while retrieving the car'});
    }
};


const getAllUserCars = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the UserCars document by userId
        const userCarsDocument = await UserCars.findById(userId);

        // Check if the user exists
        if (!userCarsDocument) {
            return res.status(404).json({message: 'getAllUserCars not found'});
        }

        // Return the cars array
        res.status(200).json(userCarsDocument.cars);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'An error occurred while retrieving cars'});
    }
};

/************************************************************************************************************/

const updateCar = async (req, res) => {
    try {
        const userId = req.user.id;
        const carId = req.params.id;  // Assuming you pass the CarId in the URL
        const updateData = req.body;

        // Find the UserCars document by userId
        const userCarsDocument = await UserCars.findById(userId);

        if (!userCarsDocument) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the car to be updated
        const carIndex = userCarsDocument.cars.findIndex(car => car.CarId === carId);
        if (carIndex === -1) {
            return res.status(404).json({ message: 'Update Car not found' });
        }

        // If License Plate is being updated, check for conflicts
        if (updateData.LicensePlateNumber) {
            const existingCarWithLicense = userCarsDocument.cars.find(car => 
                car.LicensePlateNumber === updateData.LicensePlateNumber && car.CarId !== carId
            );
            if (existingCarWithLicense) {
                return res.status(409).json({ message: 'Car with the provided License Plate Number already exists' });
            }
        }

        // Update the car with the new data
        Object.assign(userCarsDocument.cars[carIndex], updateData);
        
        // Save the updated UserCars document
        await userCarsDocument.save();

        // Return the updated car
        res.status(200).json(userCarsDocument.cars[carIndex]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the car' });
    }
};

/************************************************************************************************************/

const deleteCar = async (req, res) => {
    try {
        const userId = req.user.id;
        const carId = req.params.id;  // Assuming you pass the CarId in the URL

        // Find the UserCars document by userId
        const userCarsDocument = await UserCars.findById(userId);

        if (!userCarsDocument) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the car exists
        const carIndex = userCarsDocument.cars.findIndex(car => car.CarId === carId);
        if (carIndex === -1) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Remove the car from the cars array
        userCarsDocument.cars.splice(carIndex, 1);
        
        // Save the updated UserCars document
        await userCarsDocument.save();

        // Return a success response
        res.status(200).json({ message: 'Car deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the car' });
    }
};



module.exports = {
    addCarToUser,
    getUserCar,
    getAllUserCars,
    updateCar,
    deleteCar
};