const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const result = await db.execute(
            'INSERT INTO users (UserId, FirstName, LastName, DateOfBirth, Email, PhoneNumber, Password, Address, City, State, ZipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [ uuidv4(), userData.FirstName, userData.LastName, userData.DateOfBirth, userData.Email, userData.PhoneNumber, userData.Password, userData.Address, userData.City, userData.State, userData.ZipCode]
        );
        res.status(201).json(result);  // Use HTTP status code 201 for "Created"
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'An error occurred while creating the user'});
    }
};


const getUser = async (req, res) => {
    try{
        const id = req.params.id;
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE UserId = ?',
            [id]
          );
          res.status(200).json(rows);
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'An error occurred while retrieving the user'});
    }
};

const getUserByEmail = async (req, res) => {
    try{
        const email = req.params.email;
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE Email = ?',
            [email]
          );
            res.status(200).json(rows);
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'An error occurred while retrieving the user using the email'});
    }
};

const getAllUsers = async (req, res) => {
    try{
        const [rows] = await db.execute(
            'SELECT * FROM users',
            []
        );
        res.status(200).json(rows);
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'An error occurred while retrieving all users'});
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
    deleteUser
    };
