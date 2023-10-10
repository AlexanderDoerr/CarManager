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

module.exports = {
    createUserController,
    getUserController,
    getAllUsers
};