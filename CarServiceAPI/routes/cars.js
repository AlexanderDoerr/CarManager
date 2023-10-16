const { authenticateUser } = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();
const carController = require('../controller/carController');

//////////////////////////////////////////////////////////

router.post('/', authenticateUser, carController.addCarToUser);

router.get('/:id', authenticateUser, carController.getUserCar);
router.get('/', authenticateUser, carController.getAllUserCars);

router.patch('/:id', authenticateUser, carController.updateCar);

router.delete('/:id', authenticateUser, carController.deleteCar);

// Health Check Route
router.get('/health', (req, res) => {
    res.status(200).send('OK');
  });
  
  // Handle Unhandled Routes
router.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

module.exports = router;