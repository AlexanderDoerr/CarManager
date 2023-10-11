const db = require('./db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { get } = require('../routes/users');

const createUser = async (user) => {
    try {
        if(await getUserByEmail(user.Email)){
            return "User already exists"
        } else {
            let hashedPassword = await encryptPassword(user.Password);
            await db.promise().execute(
                'INSERT INTO user (UserId, FirstName, LastName, DateOfBirth, Email, PhoneNumber, Password, Address, City, State, ZipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [ uuidv4(), user.FirstName, user.LastName, user.DateOfBirth, user.Email, user.PhoneNumber, hashedPassword, user.Address, user.City, user.State, user.ZipCode]
            );
            console.log('User created successfully.');
            // Retrieve the inserted user
            const result = await getUserByEmail(user.Email);
            console.log('User retrieved successfully.')
            console.log(result);
            return result;
        }
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


const getUser = async (id) => {
    try {
        const [result] = await db.promise().execute(
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
    try{
        const [rows] = await db.promise().execute(
            'SELECT * FROM user WHERE Email = ?',
            [email]
          );
            return rows[0];
    } catch(error){
        console.log(error);
        retrun = {
            "message": "An error occurred while retrieving the user",
            error: error
        }
    }
};

const loginUser = async (email, password) => {
    try{
        const user = await getUserByEmail(email);
        if(user){
            const isMatch = await bcrypt.compare(password, user.Password);
            if(isMatch){
                return user;
            } else {
                return "Incorrect password";
            }
        } else {
            return "User does not exist";
        }
    } catch(error){
        return {
            "message": "An error occurred while loging in the user",
            error: error
        };
    }
};

const getAllUsers = async () => {
    try{
        const [rows] = await db.promise().execute(
            'SELECT * FROM user',
            []
        );
        return rows;
    } catch(error){
        console.log(error);
        return error;
    }
};

const updateUserPUT = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        const result = await db.execute(
            'UPDATE users SET FirstName = ?, LastName = ?, DateOfBirth = ?, Email = ?, PhoneNumber = ?, Password = ?, Address = ?, City = ?, State = ?, ZipCode = ? WHERE UserId = ?',
            [userData.FirstName, userData.LastName, userData.DateOfBirth, userData.Email, userData.PhoneNumber, userData.Password, userData.Address, userData.City, userData.State, userData.ZipCode, userId]
        );
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'An error occurred while updating the user'});
    }
};

const patchUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = Object.keys(req.body).map(
            key => `${key} = ?`
        ).join(', ');
        const values = Object.values(req.body).concat(userId);
        const query = `UPDATE users SET ${updates} WHERE UserId = ?`;
        const result = await db.execute(query, values);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'An error occurred while updating the user'});
    }
};

const deleteUser = async (req, res) => {
    try{
        const id = req.params.id;
        const result = await db.execute(
            'DELETE FROM users WHERE UserId = ?',
            [id]
        );
        res.status(200).json(result);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'An error occurred while deleting the user'});
    }
};

module.exports = {
    createUser,
    getUser,
    getUserByEmail,
    getAllUsers,
    updateUserPUT,
    patchUser,
    deleteUser,
    loginUser
    };
