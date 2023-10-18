// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');



// const carDetailsSchema = new mongoose.Schema({
//   CarId: {
//     type: String,
//     default: uuidv4,
//     required: true,
//     unique: true,
//     sparse: true
// },
//   Make: String,
//   Model: String,
//   Mileage: Number,
//   Year: Number,
//   Color: String,
//   VIN: {
//     type: String,
//     index: {
//       unique: true,
//       sparse: true
//     }
//   },
//   LicensePlateNumber: {
//     type: String,
//     index: {
//       unique: true,
//       sparse: true
//     }
//   },
//   Invoices: {
//     type: [String],
//     default: []
//   }
// }, { _id: false });

// const userCarsSchema = new mongoose.Schema({
//   _id: { // Using the user's ID as the primary key for the document
//     type: String,
//     unique: true
//   },
//   cars: [carDetailsSchema] // An array to hold all cars associated with the user
// });

// const UserCars = mongoose.model('UserCars', userCarsSchema);

// module.exports = UserCars;

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Part schema for the parts used in an invoice
const partSchema = new mongoose.Schema({
    name: String,
    cost: Number
}, { _id: false });

// Invoice schema
const invoiceSchema = new mongoose.Schema({
  _id: {  // Use UUID as the primary key for the invoice
    type: String,
    default: uuidv4,
    required: true,
    unique: true,
    sparse: true
},
  InvoiceNumber: {
    type: String,
    required: true,
},
    CarId: {
        type: String,
        required: true,
        min: 0
    },
    ServiceDate: {
        type: Date,
        required: true
    },
    ServiceMileage: {
        type: Number,
        required: true,
        min: 0
    },
    MechanicName: {
        type: String,
        required: true,
        min: 0
    },
    ShopName: {
        type: String,
        required: true,
        min: 0
    },
    Parts: [partSchema],
    LaborCost: {
        type: Number,
        min: 0
    },
    TotalPartsCost: Number,
    TotalCost: Number,
    ServiceTypeId: {
        type: String,
        required: true
    },
    ServiceDescription: String
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Car details schema
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
  Invoices: [{
    type: String, // References to Invoice documents
    ref: 'Invoice'
}]

}, { _id: false });

const userCarsSchema = new mongoose.Schema({
  _id: { // Using the user's ID as the primary key for the document
    type: String,
    unique: true
  },
  cars: [carDetailsSchema] // An array to hold all cars associated with the user
});

const UserCars = mongoose.model('UserCars', userCarsSchema);

module.exports = {
    UserCars: UserCars,
    Invoice: Invoice
};

