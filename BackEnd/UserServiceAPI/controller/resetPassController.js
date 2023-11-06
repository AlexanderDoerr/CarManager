const passwordReset = require('../data/passwordResetModel');
const { sendPasswordResetEmailEvent } = require('../kafka/kafkaProducer');


const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await passwordReset.getUserByEmail(email);
        if (user.UserId) {
        const token = await passwordReset.createResetToken(user.UserId);
        await sendPasswordResetEmailEvent(email, token); //testing purposes. Comment out when not testing
        res.status(200).json({ message: 'Password reset email sent successfully', token: token});
        } else {
        res.status(404).json({ message: 'No user exists with that email address' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const userToken = await passwordReset.getResetToken(token);
        if (userToken) {
        await passwordReset.patchUserPassword(userToken.UserId, password);
        await passwordReset.deleteResetToken(token);
        res.status(200).json({ message: 'Password reset successfully' });
        } else {
        res.status(404).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    requestPasswordReset,
    resetPassword,
};
