import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AddInvoicePage extends StatefulWidget {
  final String carId;

  const AddInvoicePage({Key? key, required this.carId}) : super(key: key);

  @override
  _AddInvoicePageState createState() => _AddInvoicePageState();
}

class _AddInvoicePageState extends State<AddInvoicePage> {
  final _formKey = GlobalKey<FormState>();
  String invoiceNumber = '';
  DateTime serviceDate = DateTime.now();
  int serviceMileage = 0;
  String mechanicName = '';
  String shopName = '';
  double laborCost = 0.0;
  double totalPartsCost = 0.0;
  double totalCost = 0.0;
  String serviceType = '';
  String serviceDescription = '';
  // Add fields for parts as needed

  Future<void> submitInvoice() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }
    _formKey.currentState!.save();

    // Construct the parts list
    List<Map<String, dynamic>> parts = [
      // Add your logic to handle parts
    ];

    Map<String, dynamic> invoiceData = {
      "carId": widget.carId,
      "invoice": {
        "InvoiceNumber": invoiceNumber,
        "ServiceDate": serviceDate.toIso8601String(),
        "ServiceMileage": serviceMileage,
        "MechanicName": mechanicName,
        "ShopName": shopName,
        "Parts": parts,
        "LaborCost": laborCost,
        "TotalPartsCost": totalPartsCost,
        "TotalCost": totalCost,
        "ServiceType": serviceType,
        "ServiceDescription": serviceDescription
      }
    };

    const storage = FlutterSecureStorage();
    String? jwtToken = await storage.read(key: 'jwt_token');
    if (jwtToken == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('JWT Token not found')),
      );
      return;
    }

    var response = await http.post(
      Uri.parse('http://10.0.2.2:5041/carapi/invoice/createinvoice'),
      headers: {
        'Authorization': 'Bearer $jwtToken',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(invoiceData),
    );

    if (response.statusCode == 200) {
      Navigator.of(context).pop(true); // Return true to signal a successful addition
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to add invoice')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Invoice'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: <Widget>[
              TextFormField(
                decoration: const InputDecoration(labelText: 'Invoice Number'),
                onSaved: (value) => invoiceNumber = value!,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter invoice number';
                  }
                  return null;
                },
              ),
              // Add other fields in a similar fashion
              // Implement a date picker for serviceDate
              // Implement fields for serviceMileage, mechanicName, shopName, laborCost, etc.
              ElevatedButton(
                onPressed: submitInvoice,
                child: const Text('Submit Invoice'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
