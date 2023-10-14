const Car = require('../models/carModel');

const createCar = async (req, res) => {
    try {
        const car = req.body;
        const createdCar = await Car.create(car);
        res.status(201).json(createdCar);  // Use HTTP status code 201 for "Created"
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'An error occurred while creating the car'});
    }
}