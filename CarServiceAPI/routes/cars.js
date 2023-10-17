const { authenticateUser } = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();
const carController = require('../controller/carController');
//Note to self, more specific routes go first, then more general routes go last.

// Health Check Route, this must come before the authentication routes in order to work. 
router.get('/health', (req, res) => {
  res.status(200).send('OK');
});


//////////////////////////////////////////////////////////

router.post('/createcar', authenticateUser, carController.addCarToUser);

router.get('/usercars', authenticateUser, carController.getAllUserCars);
router.get('/:id', authenticateUser, carController.getUserCar);

router.patch('/:id', authenticateUser, carController.updateCar);

router.delete('/:id', authenticateUser, carController.deleteCar);

// Handle Unhandled Routes
router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});



module.exports = router;