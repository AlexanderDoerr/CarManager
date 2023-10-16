require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // await mongoose.connect(process.env.DB_URI, {
    await mongoose.connect('mongodb://CarServiceDB:27017/Cars', { // For Docker
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // other options
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
