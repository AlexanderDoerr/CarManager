const {promiseConnection} = require('./db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

/*************************************************************************************************************************/

const generateResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

const createResetToken = async (userId) => {
    try{
        await deleteExistingResetTokens(userId);

        const token = generateResetToken();
        const [result] = await promiseConnection.execute(
            'INSERT INTO password_reset_tokens (Token, UserId) VALUES (?, ?)',
            [token, userId]
        );
        return token;
    } catch(error){
        console.log(error);
        throw new Error('An error occurred while creating the reset token: ' + error.message);
    }
};

const getResetToken = async (token) => {
    try {
        const [result] = await promiseConnection.execute(
            'SELECT * FROM password_reset_tokens WHERE Token = ?',
            [token]
        );
        const tokenData = result[0];

        if (tokenData && validateTokenTimeStamp(tokenData)) {
            return tokenData;
        } else {
            await deleteResetToken(tokenData.Token);
            return null;
        }
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving the reset token: ' + error.message);
    }
};

const validateTokenTimeStamp = (token) => {
    try {
        const tokenTimeStamp = new Date(Date.parse(token.CreatedAt + 'Z')).getTime();
        const currentTimeStamp = new Date().getTime();
        const difference = currentTimeStamp - tokenTimeStamp;
        const differenceInMinutes = Math.round(difference / 60000);
        return differenceInMinutes <= 30;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while validating the token timestamp: ' + error.message);
    }
};

/*************************************************************************************************************************/

const deleteResetToken = async (token) => {
    try{
        const [result] = await promiseConnection.execute(
            'DELETE FROM password_reset_tokens WHERE Token = ?',
            [token]
        );
        return result;
    } catch(error){
        console.log(error);
        throw new Error('An error occurred while deleting the reset token: ' + error.message);
    }
};

const deleteExistingResetTokens = async (userId) => {
    try {
        const [result] = await promiseConnection.execute(
            'DELETE FROM password_reset_tokens WHERE UserId = ?',
            [userId]
        );
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while deleting existing reset tokens: ' + error.message);
    }
};

/*************************************************************************************************************************/

const getUserByEmail = async (email) => {
    try {
        const [result] = await promiseConnection.execute(
            'SELECT UserId FROM user WHERE Email = ?',
            [email]
        );
        console.log(result[0]);
        return result[0];
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while retrieving the user: ' + error.message);
    }
};

const patchUserPassword = async (userId, password) => {
    try {
        const hash = await encryptPassword(password);
        const [result] = await promiseConnection.execute(
            'UPDATE user SET Password = ? WHERE UserId = ?',
            [hash, userId]
        );
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('An error occurred while updating the user: ' + error.message);
    }
};

const encryptPassword = async (password) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch(error){
        console.log(error);
        throw new Error('An error occurred while encrypting the password: ' + error.message);
    }    
};

/*************************************************************************************************************************/

module.exports = {
    createResetToken,
    getResetToken,
    deleteResetToken,
    getUserByEmail,
    patchUserPassword
};