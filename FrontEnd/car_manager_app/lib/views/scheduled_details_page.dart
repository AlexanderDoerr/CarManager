import 'package:flutter/material.dart';
import '../models/car_model.dart'; // Make sure to import your Car model
import '../models/maintenance_model.dart'; // Make sure to import your Maintenance model

class ScheduledDetailsPage extends StatelessWidget {
  final Maintenance maintenance;
  final Car car;

  const ScheduledDetailsPage({
    Key? key,
    required this.maintenance,
    required this.car,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Maintenance Details'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text('Service Type: ${maintenance.serviceType}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text('Due Date: ${maintenance.getFormattedDueDate()}'),
            Text('Due Mileage: ${maintenance.dueMileage}'),
            Text('Status: ${maintenance.status}'),
            const SizedBox(height: 20),
            const Text('Car Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text('Make: ${car.make}'),
            Text('Model: ${car.model}'),
            Text('Year: ${car.year}'),
            Text('Mileage: ${car.mileage}'),
            Text('Color: ${car.color}'),
            Text('VIN: ${car.vin}'),
            Text('License Plate: ${car.licensePlateNumber}'),
            // If you want to display invoices list
            // Text('Invoices: ${car.invoices.join(', ')}'),
          ],
        ),
      ),
    );
  }
}
