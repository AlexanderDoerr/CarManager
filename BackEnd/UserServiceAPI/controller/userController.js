const userData = require('../data/userModel.js');
const auth = require('../middleware/auth.js');
const { sendUserCreatedEvent  } = require('../kafka/kafkaProducer.js');
const { consumeEmailRequestEvent } = require('../kafka/kafkaConsumer.js');
const { sendEmailResponseEvent } = require('../kafka/kafkaProducer.js');

const EMAIL_EXISTS_ERROR = "Email already exists";
const PHONE_EXISTS_ERROR = "Phone number already exists";
const GENERIC_ERROR = "An error occurred while creating the user";

/****************************************************************************************************/

const validateUser = async (user) => {
    if (await userData.getUserByEmail(user.Email)) {
        throw new Error(EMAIL_EXISTS_ERROR);
    }
    if (await userData.getUserByPhoneNumber(user.PhoneNumber)) {
        throw new Error(PHONE_EXISTS_ERROR);
    }
};

const createUserController = async (req, res) => {
    try {
        const user = req.body;

        await validateUser(user);
        
        const createdUser = await userData.createUser(user);

        // If createUser didn't successfully create a user, return early
        if (!createdUser) {
            res.status(400).json({message: 'Failed to create user'});
            return;
        }

        const token = auth.generateToken(createdUser);

        // Send the user created event to Kafka
        await sendUserCreatedEvent(createdUser["UserId"]);

        res.cookie('token', token, {httpOnly: true});
        res.status(200).json({message: 'User Created'});
        
    } catch (error) {
        console.log(error);
        if ([EMAIL_EXISTS_ERROR, PHONE_EXISTS_ERROR].includes(error.message)) {
            res.status(409).json({message: error.message}); // Use HTTP status code 409 for "Conflict"
        } else {
            res.status(500).json({message: GENERIC_ERROR});
        }
    }
};

/****************************************************************************************************/

const loginUserController = async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        console.log(email);
        console.log(password);
        const loggedInUser = await userData.loginUser(email, password);
        
        if (!loggedInUser) {
            throw new Error("Unexpected error occurred");
        }
        
        const token = auth.generateToken(loggedInUser);
        res.cookie('token', token, {httpOnly: true});
        res.status(200).json({message: 'Login successful'});
        
    } catch(error){
        console.log(error);
        
        if (error.message === "User does not exist" || error.message === "Incorrect password") {
            res.status(401).json({message: error.message});
        } else {
            res.status(500).json({message: 'An error occurred while logging in the user'});
        }
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

/****************************************************************************************************/

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

/****************************************************************************************************/

const sendUsersEmail = async (userId, reminderId) => {
    try {
        const user = await userData.getUser(userId);
        const email = user.Email;

        await sendEmailResponseEvent(email, reminderId);
    } catch (error) {
        console.error(`error in sendUserEmail: ${error}`);
    }
};

consumeEmailRequestEvent(sendUsersEmail);

/****************************************************************************************************/

module.exports = {
    createUserController,
    getUserController,
    getAllUsers,
    loginUserController,
    patchUserController
};