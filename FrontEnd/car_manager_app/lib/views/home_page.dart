import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'car_details_page.dart';
import '../models/car_model.dart';
import 'add_car_page.dart';

class HomePage extends StatefulWidget {
  final String username;

  const HomePage({Key? key, required this.username}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Future<List<Car>> carsFuture;

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
      List<Car> cars =
          (json as List).map((carJson) => Car.fromJson(carJson)).toList();

      return cars;
    } else {
      throw Exception('Failed to load cars');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Car Manager'),
      ),
      body: FutureBuilder<List<Car>>(
        future: carsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (snapshot.hasData) {
            return SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text(
                      'Hello, ${widget.username}!',
                      style: const TextStyle(fontSize: 24.0),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  ...snapshot.data!
                      .map((car) => InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                      CarDetailsPage(car: car),
                                ),
                              );
                            },
                            child: ListTile(
                              title: Text('${car.make} ${car.model}'),
                              subtitle: Text(
                                  'Year: ${car.year}, Color: ${car.color}'),
                            ),
                          ))
                      .toList(),
                ],
              ),
            );
          } else {
            return const Center(child: Text('No cars found'));
          }
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddCarPage()),
          );
          setState(() {
            carsFuture = fetchUserCars();
          });
        },
        tooltip: 'Add Car',
        child: const Icon(Icons.add),
      ),
      // BottomNavigationBar and other widgets...
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.car_rental),
            label: 'Cars',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.schedule),
            label: 'Scheduled Services',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline_sharp),
            label: 'Profile',
          ),
          // Add more items as needed
        ],
        // TODO: Add navigation logic
      ),
    );
  }
}

class CarService {
  Future<List<Car>> fetchUserCars(String jwtToken) async {
    var url = Uri.parse('http://10.0.2.2:5041/carapi/car/usercars/');
    var response = await http.get(url, headers: {
      'Authorization': 'Bearer $jwtToken',
      'Content-Type': 'application/json',
    });

    if (response.statusCode == 200) {
      var json = jsonDecode(response.body);
      List<Car> cars = (json['cars'] as List)
          .map((carJson) => Car.fromJson(carJson))
          .toList();
      return cars;
    } else {
      throw Exception('Failed to load cars');
    }
  }
}

