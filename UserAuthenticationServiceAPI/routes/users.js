const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

//////////////////////////////////////////////////////////

router.post('/', userController.createUserController);
router.post('/login', userController.loginUserController);

//////////////////////////////////////////////////////////

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserController);

//////////////////////////////////////////////////////////

router.patch('/:id', userController.patchUserController);



module.exports = router;