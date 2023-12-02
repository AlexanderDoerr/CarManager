const express = require('express');
const { authenticateUser } = require('../middleware/auth.js');
const router = express.Router();
const userController = require('../controller/userController');

//////////////////////////////////////////////////////////

router.post('/register', userController.createUserController);
router.post('/login', userController.loginUserController);

//////////////////////////////////////////////////////////

router.get('/', authenticateUser, userController.getAllUsers);
router.get('/user', authenticateUser,  userController.getUserController);

//////////////////////////////////////////////////////////

// router.patch('/:id', authenticateUser, userController.patchUserController);
router.patch('/', authenticateUser, userController.patchUserController);


module.exports = router;