const { authenticateUser } = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();
const carController = require('../controller/carController');

//////////////////////////////////////////////////////////

router.post('/', authenticateUser, carController.createCar);

router.get('/:id', authenticateUser, carController.getUserCar);
router.get('/', authenticateUser, carController.getAllUserCars);

module.exports = router;