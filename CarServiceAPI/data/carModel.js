const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const carSchema = new mongoose.Schema({
  CarId: {
    type: String,
    default: () => uuidv4(),
    required: true,
    unique: true
  },
  UserId: {
    type: String,
    required: true
  },
  Make: {
    type: String,
    required: true
  },
  Model: {
    type: String,
    required: true
  },
  Mileage: {
    type: Number,
    required: true
  },
  Year: {
    type: Number,
    required: true
  },
  Color: {
    type: String,
    required: true
  },
  VIN: {
    type: String,
    required: true,
    unique: true
  },
  LicensePlateNumber: {
    type: String,
    required: true,
    unique: true
  },
  Invoices: {
    type: [String],
    default: []
  }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
