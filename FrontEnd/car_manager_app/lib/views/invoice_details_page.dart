import 'package:flutter/material.dart';
import '../models/invoice_model.dart'; // Ensure this is correctly imported

class InvoiceDetailsPage extends StatelessWidget {
  final Invoice invoice;

  const InvoiceDetailsPage({Key? key, required this.invoice}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Invoice Details'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Invoice Number: ${invoice.invoiceNumber}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Text('Service Date: ${invoice.serviceDate.toLocal()}'.split(' ')[0], style: const TextStyle(fontSize: 16)),
              Text('Mechanic Name: ${invoice.mechanicName}', style: const TextStyle(fontSize: 16)),
              Text('Shop Name: ${invoice.shopName}', style: const TextStyle(fontSize: 16)),
              Text('Service Mileage: ${invoice.serviceMileage}', style: const TextStyle(fontSize: 16)),
              Text('Service Type: ${invoice.serviceType}', style: const TextStyle(fontSize: 16)),
              const SizedBox(height: 8),
              const Text('Parts Used:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              for (var part in invoice.parts)
                Text('${part.name}: \$${part.cost.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16)),
              const SizedBox(height: 8),
              Text('Labor Cost: \$${invoice.laborCost.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16)),
              Text('Total Parts Cost: \$${invoice.totalPartsCost.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16)),
              Text('Total Cost: \$${invoice.totalCost.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text('Service Description:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              Text(invoice.serviceDescription, style: const TextStyle(fontSize: 16)),
              // Add more fields and formatting as needed
            ],
          ),
        ),
      ),
    );
  }
}
