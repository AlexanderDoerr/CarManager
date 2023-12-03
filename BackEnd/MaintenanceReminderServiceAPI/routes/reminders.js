const { authenticateUser } = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();
const reminderController = require('../controller/maintenanceController.js');
//Note to self, more specific routes go first, then more general routes go last.

// Health Check Route, this must come before the authentication routes in order to work. 
router.get('/health', (req, res) => {
  res.status(200).send('REMINDER OK');
});


//////////////////////////////////////////////////////////


router.get('/all/:carId', authenticateUser, reminderController.getAllRemindersByCarId);
router.get('/user/all', authenticateUser, reminderController.getAllRemindersByUserId);
router.get('/pending/:carId', authenticateUser, reminderController.getPendingRemindersByCarId);
router.get('/completed/:carId', authenticateUser, reminderController.getCompletedRemindersByCarId);

//Need to test below route
router.get('/types', authenticateUser, reminderController.getServiceTypesDB);


// Handle Unhandled Routes
router.use((req, res) => {
  res.status(404).json({ message: "Reminder Route not found" });
});



module.exports = router;