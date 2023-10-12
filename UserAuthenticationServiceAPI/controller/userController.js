const userData = require('../data/DAL.js');
const auth = require('../middleware/auth.js');


const createUserController = async (req, res) => {
    try {
        const user = req.body;
        if(await userData.getUserByEmail(user.Email)){
            throw new Error("Email already exists");
        } else if(await userData.getUserByPhoneNumber(user.PhoneNumber)){
            throw new Error("Phone number already exists");
        } else {
        // const createdUser = await userData.createUser(user);
        // const token = auth.generateToken(createdUser);
        // res.status(201).json(token);  // Use HTTP status code 201 for "Created"

        const result = await userData.createUser(user);
        res.status(201).json(result);  // Use HTTP status code 201 for "Created"
        }
    } catch (error) {
        console.log(error);
        if (error.message === 'User already exists' || error.message === 'Phone number already exists') {
            res.status(409).json({message: error.message}); // Use HTTP status code 409 for "Conflict"
        } else {
            res.status(500).json({message: 'An error occurred while creating the user'});
        }
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