class Car {
  final String make;
  final String model;
  final int mileage;
  final int year;
  final String color;
  final String vin;
  final String licensePlateNumber;
  final String carId;
  final List<String> invoices;

  Car({
    required this.make,
    required this.model,
    required this.mileage,
    required this.year,
    required this.color,
    required this.vin,
    required this.licensePlateNumber,
    required this.carId,
    required this.invoices,
  });

  factory Car.fromJson(Map<String, dynamic> json) {
    return Car(
      make: json['Make'],
      model: json['Model'],
      mileage: json['Mileage'],
      year: json['Year'],
      color: json['Color'],
      vin: json['VIN'],
      licensePlateNumber: json['LicensePlateNumber'],
      invoices: List<String>.from(json['Invoices'] ?? []),
      carId: json['CarId'],
    );
  }
}
