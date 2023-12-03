class User {
  String userId;
  String firstName;
  String lastName;
  String dateOfBirth;
  String email;
  String phoneNumber;
  String password;
  String address;
  String city;
  String state;
  String zipCode;
  // Add other fields as per your API

  User({
    required this.userId,
    required this.firstName,
    required this.lastName,
    required this.dateOfBirth,
    required this.email,
    required this.phoneNumber,
    required this.password,
    required this.address,
    required this.city,
    required this.state,
    required this.zipCode,
    /* Other fields */
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['UserId'],
      firstName: json['FirstName'],
      lastName: json['LastName'],
      dateOfBirth: json['DateOfBirth'],
      email: json['Email'],
      phoneNumber: json['PhoneNumber'].toString(),
      password: json['Password'],
      address: json['Address'],
      city: json['City'],
      state: json['State'],
      zipCode: json['ZipCode'].toString(),
      // Initialize other fields
    );
  }

//I beleive this is when sending the json to the api
  Map<String, dynamic> toJson() {
    return {
      'FirstName': firstName,
      'LastName': lastName,
      'Email': email,
      'PhoneNumber': phoneNumber,
      'Address': address,
      'City': city,
      'State': state,
      'ZipCode': zipCode,
      // Other fields
    };
  }

    String getFormattedBirthDate() {
    DateTime parsedDate = DateTime.parse(dateOfBirth);
    // Format the date as YYYY-MM-DD
    return "${parsedDate.year}-${parsedDate.month.toString().padLeft(2, '0')}-${parsedDate.day.toString().padLeft(2, '0')}";
  }
}
