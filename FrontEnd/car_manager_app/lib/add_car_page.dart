import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AddCarPage extends StatefulWidget {
  const AddCarPage({super.key});

  @override
  _AddCarPageState createState() => _AddCarPageState();

  
}

class _AddCarPageState extends State<AddCarPage> {
  final _formKey = GlobalKey<FormState>();
  String make = '';
  String model = '';
  int mileage = 0;
  int year = 0;
  String color = '';
  String vin = '';
  String licensePlateNumber = '';

  


  Future<void> _submitCar() async {
    const storage = FlutterSecureStorage();
    String? jwtToken = await storage.read(key: 'jwt_token');
    if (jwtToken == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('JWT Token not found')),
      );
      return;
    }

    var url = Uri.parse('http://10.0.2.2:5041/carapi/car/createcar');
    var response = await http.post(
      url,
      headers: {
        'Authorization': 'Bearer $jwtToken',
        'Content-Type': 'application/json',
      },
      body: json.encode({
        'Make': make,
        'Model': model,
        'Mileage': mileage,
        'Year': year,
        'Color': color,
        'VIN': vin,
        'LicensePlateNumber': licensePlateNumber,
      }),
    );

    if (response.statusCode == 201) {
      // Handle successful response
      Navigator.pop(context);
    } else {
      // Handle error
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to add car')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Car')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Make'),
                  onSaved: (value) => make = value!,
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Model'),
                  onSaved: (value) => model = value!,
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Mileage'),
                  keyboardType: TextInputType.number,
                  onSaved: (value) => mileage = int.parse(value!),
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Year'),
                  keyboardType: TextInputType.number,
                  onSaved: (value) => year = int.parse(value!),
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Color'),
                  onSaved: (value) => color = value!,
                ),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'VIN'),
                  onSaved: (value) => vin = value!,
                ),
                TextFormField(
                  decoration:
                      const InputDecoration(labelText: 'License Plate Number'),
                  onSaved: (value) => licensePlateNumber = value!,
                ),
                ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      _formKey.currentState!.save();
                      _submitCar();
                    }
                  },
                  child: const Text('Add Car'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
