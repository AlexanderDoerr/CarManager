import 'package:flutter/material.dart';
import './models/car_model.dart';

// Assuming this is your Car class
// class Car {
//   final String make;
//   final String model;
//   final int mileage;
//   final int year;
//   final String color;
//   final String vin;
//   final String licensePlateNumber;
//   final String carId;

//   Car({
//     required this.make,
//     required this.model,
//     required this.mileage,
//     required this.year,
//     required this.color,
//     required this.vin,
//     required this.licensePlateNumber,
//     required this.carId,
//   });
// }

class CarDetailsPage extends StatelessWidget {
  final Car car;

  const CarDetailsPage({Key? key, required this.car}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${car.make} ${car.model}'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text('Make: ${car.make}', style: const TextStyle(fontSize: 18)),
            Text('Model: ${car.model}', style: const TextStyle(fontSize: 18)),
            Text('Year: ${car.year}', style: const TextStyle(fontSize: 18)),
            Text('Mileage: ${car.mileage}', style: const TextStyle(fontSize: 18)),
            Text('Color: ${car.color}', style: const TextStyle(fontSize: 18)),
            Text('VIN: ${car.vin}', style: const TextStyle(fontSize: 18)),
            Text('License Plate: ${car.licensePlateNumber}', style: const TextStyle(fontSize: 18)),
            // Add more fields as needed
          ],
        ),
      ),
    );
  }
}
