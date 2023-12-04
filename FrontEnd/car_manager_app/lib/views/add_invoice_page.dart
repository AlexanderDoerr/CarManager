import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/invoice_model.dart';
import 'package:intl/intl.dart';

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
  List<Part> parts = [];

  final TextEditingController _invoiceNumberController =
      TextEditingController();
  final TextEditingController _serviceMileageController =
      TextEditingController();
  final TextEditingController _mechanicNameController = TextEditingController();
  final TextEditingController _shopNameController = TextEditingController();
  final TextEditingController _laborCostController = TextEditingController();
  final TextEditingController _totalPartsCostController =
      TextEditingController();
  final TextEditingController _totalCostController = TextEditingController();
  final TextEditingController _serviceTypeController = TextEditingController();
  final TextEditingController _serviceDescriptionController =
      TextEditingController();
  // Add fields for parts as needed

  // Method to add a part
  void addPart() {
    setState(() {
      parts.add(Part(name: '', cost: 0.0));
    });
  }

  Future<void> submitInvoice() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }
    _formKey.currentState!.save();

    List<Map<String, dynamic>> serializedParts =
        parts.map((p) => p.toJson()).toList();

    Map<String, dynamic> invoiceData = {
      "carId": widget.carId,
      "invoice": {
        "InvoiceNumber": _invoiceNumberController.text,
        "ServiceDate": serviceDate.toIso8601String(),
        "ServiceMileage": int.parse(_serviceMileageController.text),
        "MechanicName": _mechanicNameController.text,
        "ShopName": _shopNameController.text,
        "Parts": serializedParts,
        "LaborCost": double.parse(_laborCostController.text),
        "TotalPartsCost": double.parse(_totalPartsCostController.text),
        "TotalCost": double.parse(_totalCostController.text),
        "ServiceType": _serviceTypeController.text,
        "ServiceDescription": _serviceDescriptionController.text,
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

    if (response.statusCode == 201) {
      Navigator.of(context)
          .pop(true); // Return true to signal a successful addition
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to add invoice')),
      );
    }
  }

  Future<List<String>> fetchServiceTypes() async {
    // Create an instance of FlutterSecureStorage
    const storage = FlutterSecureStorage();

    // Read the JWT token from secure storage
    String? jwtToken = await storage.read(key: 'jwt_token');
    if (jwtToken == null) {
      throw Exception('JWT Token not found');
    }

    // Make the HTTP request using the JWT token
    final response = await http.get(
      Uri.parse('http://10.0.2.2:5041/reminderapi/types'),
      headers: {
        'Authorization': 'Bearer $jwtToken',
        'Content-Type': 'application/json',
      },
    );

    // Process the response
    if (response.statusCode == 200) {
      List<dynamic> typesJson = jsonDecode(response.body);
      List<String> serviceTypes =
          typesJson.map((json) => json['serviceType'] as String).toList();
      return serviceTypes;
    } else {
      throw Exception('Failed to load service types');
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
                controller: _invoiceNumberController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter invoice number';
                  }
                  return null;
                },
              ),
              ListTile(
                title: const Text('Service Date'),
                subtitle: Text(serviceDate.toString()),
                onTap: () async {
                  final newDate = await showDatePicker(
                    context: context,
                    initialDate: serviceDate,
                    firstDate: DateTime(2000),
                    lastDate: DateTime(2025),
                  );
                  if (newDate != null && newDate != serviceDate) {
                    setState(() {
                      serviceDate = newDate;
                    });
                  }
                },
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Service Mileage'),
                controller: _serviceMileageController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter service mileage';
                  }
                  return null;
                },
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Mechanic Name'),
                controller: _mechanicNameController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter mechanic name';
                  }
                  return null;
                },
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Shop Name'),
                controller: _shopNameController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter shop name';
                  }
                  return null;
                },
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Labor Cost'),
                controller: _laborCostController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter labor cost';
                  }
                  return null;
                },
              ),
              TextFormField(
                decoration:
                    const InputDecoration(labelText: 'Total Parts Cost'),
                controller: _totalPartsCostController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter total parts cost';
                  }
                  return null;
                },
              ),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Total Cost'),
                controller: _totalCostController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter total cost';
                  }
                  return null;
                },
              ),
              FutureBuilder<List<String>>(
                future: fetchServiceTypes(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const CircularProgressIndicator();
                  } else if (snapshot.hasError) {
                    return Text('Error: ${snapshot.error}');
                  } else {
                    // Dropdown menu
                    return DropdownButtonFormField<String>(
                      value: _serviceTypeController.text.isNotEmpty
                          ? _serviceTypeController.text
                          : null,
                      decoration:
                          const InputDecoration(labelText: 'Service Type'),
                      items: snapshot.data!
                          .map<DropdownMenuItem<String>>((String value) {
                        return DropdownMenuItem<String>(
                          value: value,
                          child: Text(value),
                        );
                      }).toList(),
                      onChanged: (String? newValue) {
                        setState(() {
                          _serviceTypeController.text = newValue!;
                        });
                      },
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please select a service type';
                        }
                        return null;
                      },
                    );
                  }
                },
              ),
              TextFormField(
                decoration:
                    const InputDecoration(labelText: 'Service Description'),
                controller: _serviceDescriptionController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter service description';
                  }
                  return null;
                },
              ),
              // Parts list and add part button
              ...parts.asMap().entries.map((entry) {
                int index = entry.key;
                Part part = entry.value;
                return PartField(part: part, index: index);
              }).toList(),
              ElevatedButton(
                onPressed: addPart,
                child: const Text('Add Part'),
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

  @override
  void dispose() {
    _invoiceNumberController.dispose();
    _serviceMileageController.dispose();
    _mechanicNameController.dispose();
    _shopNameController.dispose();
    _laborCostController.dispose();
    _totalPartsCostController.dispose();
    _totalCostController.dispose();
    _serviceTypeController.dispose();
    _serviceDescriptionController.dispose();
    super.dispose();
  }
}

class PartField extends StatefulWidget {
  final Part part;
  final int index; // Added index

  const PartField({Key? key, required this.part, required this.index})
      : super(key: key);

  @override
  _PartFieldState createState() => _PartFieldState();
}

class _PartFieldState extends State<PartField> {
  late TextEditingController _nameController;
  late TextEditingController _costController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.part.name);
    _costController = TextEditingController(text: widget.part.cost.toString());
  }

  @override
  void dispose() {
    _nameController.dispose();
    _costController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: TextFormField(
            controller: _nameController,
            decoration: const InputDecoration(labelText: 'Part Name'),
            onChanged: (value) => widget.part.name = value,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter part name';
              }
              return null;
            },
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: TextFormField(
            controller: _costController,
            decoration: const InputDecoration(labelText: 'Part Cost'),
            keyboardType: TextInputType.number,
            onChanged: (value) =>
                widget.part.cost = double.tryParse(value) ?? 0.0,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter part cost';
              }
              return null;
            },
          ),
        ),
      ],
    );
  }
}
