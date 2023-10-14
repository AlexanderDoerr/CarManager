const Car = require('../data/carModel');
const jwt = require('jsonwebtoken');

const createCar = async (req, res) => {
    try {
        const userId = req.user.id;
        const carData = req.body;
        const car = { UserId: userId, ...carData };
        const createdCar = await Car.create(car);
        res.status(201).json(createdCar);  // Use HTTP status code 201 for "Created"
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'An error occurred while creating the car'});
    }
}

const getUserCar = async (req, res) => {
    try {
        const userId = req.user.id;
        const carId = req.params.id;
        const car = await Car.findOne({ UserId: userId, CarId: carId });
        if (car) {
            res.status(200).json(car);
        } else {
            res.status(404).json({message: 'Car not found'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'An error occurred while retrieving the car'});
    }
};

const getAllUserCars = async (req, res) => {
    try {
        const userId = req.user.id;
        const cars = await Car.find({ UserId: userId });
        res.status(200).json(cars);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'An error occurred while retrieving cars'});
    }
}



module.exports = {
    createCar,
    getUserCar,
    getAllUserCars
};