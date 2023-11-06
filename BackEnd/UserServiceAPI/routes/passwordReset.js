const express = require('express');
const password = require('../controller/resetPassController');
const router = express.Router();

router.post('//reset', password.requestPasswordReset);
router.post('/reset/:token', password.resetPassword);


module.exports = router;
