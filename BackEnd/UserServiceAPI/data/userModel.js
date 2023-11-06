const {promiseConnection} = require('./db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { get } = require('../routes/users');

const createUser = async (user) => {
    try {
        let hashedPassword = await encryptPassword(user.Password);
        await promiseConnection.execute(
            'INSERT INTO user (UserId, FirstName, LastName, DateOfBirth, Email, PhoneNumber, Password, Address, City, State, ZipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [ uuidv4(), user.FirstName, user.LastName, user.DateOfBirth, user.Email, user.PhoneNumber, hashedPassword, user.Address, user.City, user.State, user.ZipCode]
        );
        console.log('User created successfully.');
        // Retrieve the inserted user
        const result = await getUserByEmail(user.Email);
        console.log('User retrieved successfully.')
        console.log(result);
        return result;

    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while creating the user: ' + error.message);
    }
};

const encryptPassword = async (password) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch(error){
        console.log(error);
    }
};

/****************************************************************************************************/

const getUser = async (id) => {
    try {
        const [result] = await promiseConnection.execute(
            'SELECT * FROM user WHERE UserId = ?',
            [id]
        );
        return result[0];
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving the user: ' + error.message);
    }
};


const getUserByEmail = async (email) => {
    try {
        const [rows] = await promiseConnection.execute(
            'SELECT * FROM user WHERE Email = ?',
            [email]
        );
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while retrieving the user");
    }
};


const getUserByPhoneNumber = async (phoneNumber) => {
    try{
        const [rows] = await promiseConnection.execute(
            'SELECT * FROM user WHERE PhoneNumber = ?',
            [phoneNumber]
            );
            return rows[0];
    } catch(error){
        console.log(error);
        return {
            "message": "An error occurred while retrieving the user",
            error: error
        }
    }
};

const getAllUsers = async () => {
    try{
        const [rows] = await promiseConnection.execute(
            'SELECT * FROM user',
            []
        );
        return rows;
    } catch(error){
        console.log(error);
        return error;
    }
};

const loginUser = async (email, password) => {
    const user = await getUserByEmail(email);
    if(!user){
        throw new Error("User does not exist");
    }
    const isMatch = await bcrypt.compare(password, user.Password);
    if(!isMatch){
        throw new Error("Incorrect password");
    }
    return user;
};

/****************************************************************************************************/

const patchUser = async (userId, userUpdates) => {
    try {
        const updates = Object.keys(userUpdates).map(
            key => `${key} = ?`
        ).join(', ');
        const values = Object.values(userUpdates).concat(userId);
        const query = `UPDATE user SET ${updates} WHERE UserId = ?`;
        const result = await promiseConnection.execute(query, values);
        return result;
    } catch (error) {
        console.log(error);
        return {
            "message": "An error occurred while updating the user",
            error: error
        }
    }
};

/****************************************************************************************************/

const deleteUser = async (req, res) => {
    try{
        const id = req.params.id;
        const result = await promiseConnection.execute(
            'DELETE FROM users WHERE UserId = ?',
            [id]
        );
        res.status(200).json(result);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'An error occurred while deleting the user'});
    }
};

/****************************************************************************************************/

module.exports = {
    createUser,
    getUser,
    getUserByEmail,
    getAllUsers,
    patchUser,
    deleteUser,
    loginUser,
    getUserByPhoneNumber
    };
