import 'dart:html';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class HomePage extends StatelessWidget {
  final String username;

  const HomePage({Key? key, required this.username}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, $username'),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            // Car Summary Section
            // Add your code to fetch and display car data here

            // Quick Access Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                ElevatedButton(
                  onPressed: () {
                    // Navigate to Add Car Page
                  },
                  child: const Text('Add Car'),
                ),
                ElevatedButton(
                  onPressed: () {
                    // Navigate to Schedule Maintenance Page
                  },
                  child: const Text('Scheduled Maintenance'),
                ),
                ElevatedButton(
                  onPressed: () {
                    // Navigate to View Invoices Page
                  },
                  child: const Text('View Invoices'),
                ),
              ],
            ),

            // Upcoming Maintenance Reminders Section
            // Add your code to fetch and display reminders here
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.car_rental),
            label: 'Cars',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long),
            label: 'Invoices',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline_sharp),
            label: 'Profile',
          ),
          // Add more items as needed
        ],
        // Add your code for navigation bar item taps here
      ),
    );
  }
}
