class Maintenance {
  String reminderId;
  String carId;
  String serviceType;
  String dueDate;
  int dueMileage;
  String status;

  Maintenance({
    required this.reminderId,
    required this.carId,
    required this.serviceType,
    required this.dueDate,
    required this.dueMileage,
    required this.status,
  });

  factory Maintenance.fromJson(Map<String, dynamic> json) {
    return Maintenance(
      reminderId: json['reminderId'],
      carId: json['carId'],
      serviceType: json['serviceType'],
      dueDate: json['dueDate'],
      dueMileage: json['dueMileage'],
      status: json['status'],
    );
  }

    String getFormattedDueDate() {
    DateTime parsedDate = DateTime.parse(dueDate);
    // Format the date as YYYY-MM-DD
    return "${parsedDate.year}-${parsedDate.month.toString().padLeft(2, '0')}-${parsedDate.day.toString().padLeft(2, '0')}";
  }
}
