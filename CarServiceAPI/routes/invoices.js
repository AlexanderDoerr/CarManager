const { authenticateUser } = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();
const invoiceController = require('../controller/invoiceController');

//Note to self, more specific routes go first, then more general routes go last.

// Health Check Route, this must come before the authentication routes in order to work. 
router.get('/health', (req, res) => {
  res.status(200).send('INVOICE OK');
});


//////////////////////////////////////////////////////////

router.post('/createinvoice', authenticateUser, invoiceController.AddInvoice);

//////////////////////////////////////////////////////////
// Handle Unhandled Routes
router.use((req, res) => {
  res.status(404).json({ message: "Invoice Route not found" });
});



module.exports = router;