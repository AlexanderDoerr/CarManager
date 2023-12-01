// import 'package:flutter/material.dart';
// import './models/car_model.dart';

// class CarDetailsPage extends StatelessWidget {
//   final Car car;

//   const CarDetailsPage({Key? key, required this.car}) : super(key: key);

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('${car.make} ${car.model}'),
//       ),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: <Widget>[
//             Text('Make: ${car.make}', style: const TextStyle(fontSize: 18)),
//             Text('Model: ${car.model}', style: const TextStyle(fontSize: 18)),
//             Text('Year: ${car.year}', style: const TextStyle(fontSize: 18)),
//             Text('Mileage: ${car.mileage}', style: const TextStyle(fontSize: 18)),
//             Text('Color: ${car.color}', style: const TextStyle(fontSize: 18)),
//             Text('VIN: ${car.vin}', style: const TextStyle(fontSize: 18)),
//             Text('License Plate: ${car.licensePlateNumber}', style: const TextStyle(fontSize: 18)),
//             // Add more fields as needed
//           ],
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/car_model.dart';
import '../models/invoice_model.dart'; // Ensure you have this model
import 'invoice_details_page.dart'; // Ensure you have this page for detailed invoice view
import 'add_invoice_page.dart'; // Ensure you have this page for adding invoices

class CarDetailsPage extends StatefulWidget {
  final Car car;

  const CarDetailsPage({Key? key, required this.car}) : super(key: key);

  @override
  _CarDetailsPageState createState() => _CarDetailsPageState();
}

class _CarDetailsPageState extends State<CarDetailsPage> {
  late Future<List<Invoice>> invoicesFuture;

  @override
  void initState() {
    super.initState();
    invoicesFuture = fetchCarInvoices();
  }

Future<List<Invoice>> fetchCarInvoices() async {
  const storage = FlutterSecureStorage();
  String? jwtToken = await storage.read(key: 'jwt_token');
  if (jwtToken == null) throw Exception('JWT Token not found');

  var url = Uri.parse('http://10.0.2.2:5041/carapi/invoice/cars/${widget.car.carId}/invoices');
  var response = await http.get(url, headers: {
    'Authorization': 'Bearer $jwtToken',
    'Content-Type': 'application/json',
  });

  if (response.statusCode == 200) {
    var json = jsonDecode(response.body);
    List<Invoice> invoices = 
        (json as List).map((invoiceJson) => Invoice.fromJson(invoiceJson)).toList();

    return invoices;
  } else if (response.statusCode == 500) {
    var json = jsonDecode(response.body);
    if (json['error'] == 'No invoices found for the car') {
      // Return an empty list to indicate no invoices found
      return [];
    } else {
      // Handle other server errors
      throw Exception('Server error: ${json['message']}');
    }
  } else {
    // Handle other HTTP errors
    throw Exception('Failed to load invoices');
  }
}


  @override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: Text('${widget.car.make} ${widget.car.model}'),
    ),
    body: Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text('Make: ${widget.car.make}', style: const TextStyle(fontSize: 18)),
          Text('Model: ${widget.car.model}', style: const TextStyle(fontSize: 18)),
          Text('Year: ${widget.car.year}', style: const TextStyle(fontSize: 18)),
          Text('Mileage: ${widget.car.mileage}', style: const TextStyle(fontSize: 18)),
          Text('Color: ${widget.car.color}', style: const TextStyle(fontSize: 18)),
          Text('VIN: ${widget.car.vin}', style: const TextStyle(fontSize: 18)),
          Text('License Plate: ${widget.car.licensePlateNumber}', style: const TextStyle(fontSize: 18)),
          const SizedBox(height: 16), // Spacing between car details and invoice list
          const Text('Invoices:', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          Expanded(
            child: FutureBuilder<List<Invoice>>(
              future: invoicesFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (snapshot.hasData && snapshot.data!.isNotEmpty) {
                  return ListView.builder(
                    itemCount: snapshot.data!.length,
                    itemBuilder: (context, index) {
                      Invoice invoice = snapshot.data![index];
                      return ListTile(
                        title: Text('Invoice Number: ${invoice.invoiceNumber}'),
                        subtitle: Text('Service Date: ${invoice.serviceDate}'),
                        // subtitle: Text('Service Date: ${invoice.serviceDate.toLocal()}'.split(' ')[0]),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => InvoiceDetailsPage(invoice: invoice),
                            ),
                          );
                        },
                      );
                    },
                  );
                } else {
                  return const Center(child: Text('No invoices found'));
                }
              },
            ),
            
          ),
        ],
      ),
    ),
    floatingActionButton: FloatingActionButton(
      onPressed: () async {
        // Navigate to a page to add a new invoice
        var result = await Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => AddInvoicePage(carId: widget.car.carId)),
        );
        
        // Check if an invoice was added and refresh the list if so
        if (result == true) {
          setState(() {
            invoicesFuture = fetchCarInvoices();
          });
        }
      },
      tooltip: 'Add Invoice',
      child: const Icon(Icons.add),
    ),
  );
}

}

