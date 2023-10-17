// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const carSchema = new mongoose.Schema({
//   CarId: {
//     type: String,
//     default: () => uuidv4(),
//     required: true,
//     unique: true
//   },
//   UserId: {
//     type: String,
//     required: true
//   },
//   Make: {
//     type: String,
//     required: true
//   },
//   Model: {
//     type: String,
//     required: true
//   },
//   Mileage: {
//     type: Number,
//     required: true
//   },
//   Year: {
//     type: Number,
//     required: true
//   },
//   Color: {
//     type: String,
//     required: true
//   },
//   VIN: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   LicensePlateNumber: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   Invoices: {
//     type: [String],
//     default: []
//   }
// });

// const Car = mongoose.model('Car', carSchema);

// module.exports = Car;

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');



const carDetailsSchema = new mongoose.Schema({
  CarId: {
    type: String,
    default: uuidv4,
    required: true,
    unique: true,
    sparse: true
},
  Make: String,
  Model: String,
  Mileage: Number,
  Year: Number,
  Color: String,
  VIN: {
    type: String,
    index: {
      unique: true,
      sparse: true
    }
  },
  LicensePlateNumber: {
    type: String,
    index: {
      unique: true,
      sparse: true
    }
  },
  Invoices: {
    type: [String],
    default: []
  }
}, { _id: false });

const userCarsSchema = new mongoose.Schema({
  _id: { // Using the user's ID as the primary key for the document
    type: String,
    unique: true
  },
  cars: [carDetailsSchema] // An array to hold all cars associated with the user
});

const UserCars = mongoose.model('UserCars', userCarsSchema);

module.exports = UserCars;

