import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/car_model.dart';
import '../models/maintenance_model.dart';
import 'profile_page.dart';
import 'home_page.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'scheduled_details_page.dart';

class ScheduledMaintenancePage extends StatefulWidget {
  const ScheduledMaintenancePage({Key? key}) : super(key: key);

  @override
  _ScheduledMaintenancePageState createState() => _ScheduledMaintenancePageState();
}

class _ScheduledMaintenancePageState extends State<ScheduledMaintenancePage> {
  late Future<List<Maintenance>> maintenanceFuture;
  int _currentIndex = 1;

  @override
  void initState() {
    super.initState();
    maintenanceFuture = fetchScheduledMaintenance();
  }

Future<Car> fetchUserCar(String carId) async {
  const storage = FlutterSecureStorage();
  String? jwtToken = await storage.read(key: 'jwt_token');
  if (jwtToken == null) throw Exception('JWT Token not found');

  var url = Uri.parse('http://10.0.2.2:5041/carapi/car/$carId');
  var response = await http.get(url, headers: {
    'Authorization': 'Bearer $jwtToken',
    'Content-Type': 'application/json',
  });

  if (response.statusCode == 200) {
    var json = jsonDecode(response.body);
    Car car = Car.fromJson(json); // Assuming Car.fromJson can handle this JSON structure

    return car;
  } else {
    throw Exception('Failed to load car');
  }
}


Future<List<Maintenance>> fetchScheduledMaintenance() async {
  const storage = FlutterSecureStorage();
  String? jwtToken = await storage.read(key: 'jwt_token');
  
  if (jwtToken == null) {
    throw Exception('JWT Token not found');
  }

  final url = Uri.parse('http://10.0.2.2:5041/reminderapi/user/all');
  
  try {
    final response = await http.get(url, headers: {
      'Authorization': 'Bearer $jwtToken',
      'Content-Type': 'application/json',
    });

    if (response.statusCode != 200) {
      throw Exception('Failed to load maintenance: Server responded with status code ${response.statusCode}');
    }

    final List<dynamic> jsonResponse = jsonDecode(response.body);

    if (jsonResponse.isEmpty) {
      throw Exception('No maintenance data available');
    }

    return jsonResponse.map((maintenanceJson) => Maintenance.fromJson(maintenanceJson)).toList();
  } catch (e) {
    // You can further handle specific exceptions if needed
    throw Exception('An error occurred while fetching maintenance: ${e.toString()}');
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scheduled Maintenance'),
      ),
      body: FutureBuilder<List<Maintenance>>(
        future: maintenanceFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (snapshot.hasData) {
            return ListView.builder(
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                var maintenance = snapshot.data![index];
                return ListTile(
                  title: Text(maintenance.serviceType),
                  subtitle: Text('Due Date: ${maintenance.getFormattedDueDate()}, Mileage: ${maintenance.dueMileage}'),
                  onTap: () async {
                    var localContext = context;
                    try {
                      Car car = await fetchUserCar(maintenance.carId);
                      Navigator.push(
                        localContext,
                        MaterialPageRoute(
                          builder: (localContext) => ScheduledDetailsPage(maintenance: maintenance, car: car),
                        ),
                      );
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Error: ${e.toString()}')),
                      );
                    }
                  },
                );
              },
            );
          } else {
            return const Center(child: Text('No scheduled maintenance found'));
          }
        },
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onItemTapped,
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.car_rental),
            label: 'Cars',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.build),
            label: 'Scheduled Services',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

    void _onItemTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
    switch (index) {
      case 0: // Home
                Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (context) => const HomePage(username: 'john'),));
        break;
      case 1: // Maintenance
        
        break;
      case 2: // Profile
          Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (context) => const ProfilePage()));
        break;
    }
  }
}
