class Invoice {
  final String id;
  final String invoiceNumber;
  final String carId;
  final DateTime serviceDate;
  final int serviceMileage;
  final String mechanicName;
  final String shopName;
  final List<Part> parts;
  final double laborCost;
  final double totalPartsCost;
  final double totalCost;
  final String serviceType;
  final String serviceDescription;

  Invoice({
    required this.id,
    required this.invoiceNumber,
    required this.carId,
    required this.serviceDate,
    required this.serviceMileage,
    required this.mechanicName,
    required this.shopName,
    required this.parts,
    required this.laborCost,
    required this.totalPartsCost,
    required this.totalCost,
    required this.serviceType,
    required this.serviceDescription,
  });

  factory Invoice.fromJson(Map<String, dynamic> json) {
    return Invoice(
      id: json['_id'],
      invoiceNumber: json['InvoiceNumber'],
      carId: json['CarId'],
      serviceDate: DateTime.parse(json['ServiceDate']),
      serviceMileage: json['ServiceMileage'],
      mechanicName: json['MechanicName'],
      shopName: json['ShopName'],
      parts: (json['Parts'] as List).map((p) => Part.fromJson(p)).toList(),
      laborCost: json['LaborCost'].toDouble(),
      totalPartsCost: json['TotalPartsCost'].toDouble(),
      totalCost: json['TotalCost'].toDouble(),
      serviceType: json['ServiceType'],
      serviceDescription: json['ServiceDescription'],
    );
  }

    String getFormattedServiceDate() {
    // Format the date as YYYY-MM-DD
    return "${serviceDate.year}-${serviceDate.month.toString().padLeft(2, '0')}-${serviceDate.day.toString().padLeft(2, '0')}";
  }
}

class Part {
  String name;
  double cost;

  Part({required this.name, required this.cost});

  // Converts a Part object to a Map object for JSON serialization.
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'cost': cost,
    };
  }

  // Creates a Part object from a JSON map.
  factory Part.fromJson(Map<String, dynamic> json) {
    return Part(
      name: json['name'],
      cost: json['cost'].toDouble(),
    );
  }
}

