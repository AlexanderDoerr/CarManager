import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/car_model.dart';
import '../models/maintenance_model.dart';
import 'profile_page.dart';
import 'home_page.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ScheduledMaintenancePage extends StatefulWidget {
  const ScheduledMaintenancePage({Key? key}) : super(key: key);

  @override
  _ScheduledMaintenancePageState createState() => _ScheduledMaintenancePageState();
}

class _ScheduledMaintenancePageState extends State<ScheduledMaintenancePage> {
  late Future<List<Maintenance>> maintenanceFuture;
  late Future<List<Car>> carsFuture;
  int _currentIndex = 1;

  @override
  void initState() {
    super.initState();
    carsFuture = fetchUserCars();
  }

  Future<List<Car>> fetchUserCars() async {
    const storage = FlutterSecureStorage();
    String? jwtToken = await storage.read(key: 'jwt_token');
    if (jwtToken == null) throw Exception('JWT Token not found');

    var url = Uri.parse('http://10.0.2.2:5041/carapi/car/usercars/');
    var response = await http.get(url, headers: {
      'Authorization': 'Bearer $jwtToken',
      'Content-Type': 'application/json',
    });

    if (response.statusCode == 200) {
      var json = jsonDecode(response.body);
      List<Car> cars = (json as List).map((carJson) => Car.fromJson(carJson)).toList();

      return cars;
    } else {
      throw Exception('Failed to load cars');
    }
  }

  Future<List<Maintenance>> fetchScheduledMaintenance(String carId) async {
    var url = Uri.parse('http://10.0.2.2:5041/reminderapi/pending/$carId');
    var response = await http.get(url, headers: {
      'Authorization': 'Bearer [Your_JWT_Token]',
      'Content-Type': 'application/json',
    });

    if (response.statusCode == 200) {
      var json = jsonDecode(response.body);
      List<Maintenance> maintenanceList = 
          (json as List).map((maintenanceJson) => Maintenance.fromJson(maintenanceJson)).toList();

      return maintenanceList;
    } else {
      throw Exception('Failed to load maintenance');
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
    switch (index) {
      case 0: // Home
                Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (context) => HomePage(username: 'john'),));
        break;
      case 1: // Maintenance
        
        break;
      case 2: // Profile
          Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (context) => const ProfilePage()));
        break;
    }
  }

//TODO Change this to display the cars then use a inkwell to go to a new page and display the pending maintenance for the specific car
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Scheduled Maintenance'),
      ),
      body: FutureBuilder<List<Maintenance>>(
        future: maintenanceFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (snapshot.hasData) {
            return ListView.builder(
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                var maintenance = snapshot.data![index];
                return ListTile(
                  title: Text(maintenance.serviceType),
                  subtitle: Text('Due Date: ${maintenance.dueDate}, Mileage: ${maintenance.dueMileage}'),
                );
              },
            );
          } else {
            return Center(child: Text('No scheduled maintenance found'));
          }
        },
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onItemTapped,
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
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
}
