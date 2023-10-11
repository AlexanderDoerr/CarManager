const userData = require('../data/DAL.js');


const createUserController = async (req, res) => {
    try {
        const user = req.body;
        const result = await userData.createUser(user);
        res.status(201).json(result);  // Use HTTP status code 201 for "Created"
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'An error occurred while creating the user'});
    }
};

const loginUserController = async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const result = await userData.loginUser(email, password);
        res.status(200).json(result);
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'An error occurred while logging in the user'});
    }
};

const getUserController = async (req, res) => {
    try{
        const id = req.params.id;
        console.log(id);
        const result = await userData.getUser(id);
        res.status(200).json(result);
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'An error occurred while retrieving the user'});
    }
}

const getAllUsers = async (req, res) => {
    try{
        const result = await userData.getAllUsers();
        res.status(200).json(result);
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'An error occurred while retrieving all users'});
    }
}

const patchUserController = async (req, res) => { 
    try{
        const userId = req.params.id;
        const userUpdateData = req.body;
        const result = await userData.patchUser(userId, userUpdateData);
        res.status(200).json(result);
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'An error occurred while updating the user'});
    }
};

module.exports = {
    createUserController,
    getUserController,
    getAllUsers,
    loginUserController,
    patchUserController
};