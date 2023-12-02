import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/user_model.dart'; // Import your User model
import 'package:flutter/services.dart';
import 'home_page.dart';
import 'package:car_manager_app/main.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({Key? key}) : super(key: key);

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final _formKey = GlobalKey<FormState>(); // Create a global key for the form
  late bool isEditMode;
   User? user;
  int _currentIndex = 2;

  // TextEditingControllers
  late TextEditingController firstNameController;
  late TextEditingController lastNameController;
  late TextEditingController emailController;
  late TextEditingController phoneNumberController;
  late TextEditingController addressController;
  late TextEditingController cityController;
  late TextEditingController stateController;
  late TextEditingController zipCodeController;

  @override
  void initState() {
    super.initState();
    isEditMode = false;

    firstNameController = TextEditingController();
    lastNameController = TextEditingController();
    emailController = TextEditingController();
    phoneNumberController = TextEditingController();
    addressController = TextEditingController();
    cityController = TextEditingController();
    stateController = TextEditingController();
    zipCodeController = TextEditingController();

    fetchUserProfile();
  }

  Future<void> fetchUserProfile() async {
    try {
      const storage = FlutterSecureStorage();
      String? jwtToken = await storage.read(key: 'jwt_token');
      if (jwtToken == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('JWT Token not found')),
        );
        return;
      }

      var url = Uri.parse('http://10.0.2.2:5041/userapi/user/user');
      var response = await http.get(url, headers: {
        'Authorization': 'Bearer $jwtToken',
        'Content-Type': 'application/json',
      });



      if (response.statusCode == 200) {
        var jsonData = jsonDecode(response.body);
        print(jsonData);
        setState(() {
          user = User.fromJson(jsonData); // Assuming you have a fromJson method

          // Initialize controllers with user data
          // firstNameController.text = user.firstName;
          // lastNameController.text = user.lastName;
          // emailController.text = user.email;
          // phoneNumberController.text = user.phoneNumber;
          // addressController.text = user.address;
          // cityController.text = user.city;
          // stateController.text = user.state;
          // zipCodeController.text = user.zipCode;
        firstNameController.text = user?.firstName ?? '';
        lastNameController.text = user?.lastName ?? '';
        emailController.text = user?.email ?? '';
        phoneNumberController.text = user?.phoneNumber ?? '';
        addressController.text = user?.address ?? '';
        cityController.text = user?.city ?? '';
        stateController.text = user?.state ?? '';
        zipCodeController.text = user?.zipCode ?? '';
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to load user data')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('An error occurred: $e')),
      );
      print(e);
    }
  }

  Future<void> updateUserProfile() async {
    // Implement the PATCH request to update user data
    try {
      Map<String, dynamic> userData = {
        'FirstName': firstNameController.text,
        'LastName': lastNameController.text,
        'Email': emailController.text,
        'PhoneNumber': phoneNumberController.text,
        'Address': addressController.text,
        'City': cityController.text,
        'State': stateController.text,
        'ZipCode': zipCodeController.text,
      };

      const storage = FlutterSecureStorage();
      String? jwtToken = await storage.read(key: 'jwt_token');
      if (jwtToken == null) throw Exception('JWT Token not found');

      var url = Uri.parse('http://10.0.2.2:5041/userapi/user/');
      var response = await http.patch(url,
          headers: {
            'Authorization': 'Bearer $jwtToken',
            'Content-Type': 'application/json',
          },
          body: jsonEncode(userData));

      if (response.statusCode == 200) {
        await fetchUserProfile(); // Re-fetch user data

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully!')),
        );

        setState(() {
          isEditMode = false;
        });
      } else {
        // Show error message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to update user data')),
        );
      }
    } catch (e) {
      // Handle any other errors, possibly network errors
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('An error occurred: $e')),
      );
    }
  }

Future<void> _logout() async {
  const storage = FlutterSecureStorage();
  await storage.delete(key: 'jwt_token'); // Clears the JWT token

  // Navigate back to the LoginPage
  Navigator.of(context).pushReplacement(
    MaterialPageRoute(builder: (context) => const LoginPage()),
  );
}



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: isEditMode ? buildEditView() : buildReadOnlyView(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onItemTapped,
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
        // Implement the navigation logic
      ),
    );
  }

    void _onItemTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
    switch (index) {
      case 0:
        // Navigate to HomePage
        Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (context) => HomePage(username: firstNameController.text),));
        break;
      // case 1:
      //   // Navigate to Scheduled Services
      //   Navigator.pushReplacement(context,
      //     MaterialPageRoute(builder: (context) => ScheduledServicesPage()));
      //   break;
      case 2:
        // Already on ProfilePage
        break;
    }
  }

  @override
  void dispose() {
    // Dispose controllers when the state is disposed
    firstNameController.dispose();
    lastNameController.dispose();
    emailController.dispose();
    phoneNumberController.dispose();
    addressController.dispose();
    cityController.dispose();
    stateController.dispose();
    zipCodeController.dispose();
    super.dispose();
  }

//   Widget buildReadOnlyView() {
//   // Check if 'user' is null and show a loading indicator if it is
//   if (user == null) {
//     return const Center(child: CircularProgressIndicator());
//   } else {
//     // Build the user profile view once the 'user' data is available
//     return Column(
//       children: <Widget>[
//         Text('Name: ${user!.firstName} ${user!.lastName}'), // Use '!' to assert that 'user' is not null
//         Text('Date of Birth: ${user!.dateOfBirth}'),
//         Text('Email: ${user!.email}'),
//         Text('Phone Number: ${user!.phoneNumber}'),
//         Text('Address: ${user!.address}'),
//         Text('City: ${user!.city}'),
//         Text('State: ${user!.state}'),
//         Text('Zip Code: ${user!.zipCode}'),
//         ElevatedButton(
//           onPressed: () => setState(() => isEditMode = true),
//           child: const Text('Edit'),
//         ),
//       ],
//     );
//   }
// }



Widget buildReadOnlyView() {
  if (user == null) {
    return const Center(child: CircularProgressIndicator());
  } else {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          _buildReadOnlyLine('Name', '${user!.firstName} ${user!.lastName}'),
          const Divider(),
          _buildReadOnlyLine('Date of Birth', user!.dateOfBirth),
          const Divider(),
          _buildReadOnlyLine('Email', user!.email),
          const Divider(),
          _buildReadOnlyLine('Phone Number', user!.phoneNumber),
          const Divider(),
          _buildReadOnlyLine('Address', user!.address),
          const Divider(),
          _buildReadOnlyLine('City', user!.city),
          const Divider(),
          _buildReadOnlyLine('State', user!.state),
          const Divider(),
          _buildReadOnlyLine('Zip Code', user!.zipCode),
          const SizedBox(height: 20),
          Center(
            child: ElevatedButton(
              onPressed: () => setState(() => isEditMode = true),
              child: const Text('Edit'),
            ),
          ),
          const SizedBox(height: 20),
          Center(
            child: ElevatedButton(
              onPressed: _logout,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red, // background
                foregroundColor: Colors.white, // foreground
              ),
              child: const Text('Logout'),
            ),
          ),
        ],
      ),
    );
  }
}

Widget _buildReadOnlyLine(String label, String value) {
  return Padding(
    padding: const EdgeInsets.symmetric(vertical: 8.0),
    child: RichText(
      text: TextSpan(
        text: '$label: ',
        style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black),
        children: <TextSpan>[
          TextSpan(
            text: value,
            style: const TextStyle(fontWeight: FontWeight.normal, color: Colors.black),
          ),
        ],
      ),
    ),
  );
}




  Widget buildEditView() {
    return Form(
        key: _formKey,
        child: SingleChildScrollView(
            child: Column(
          children: <Widget>[
            TextFormField(
              controller: firstNameController,
              decoration: const InputDecoration(labelText: 'First Name'),
              validator: (value) =>
                  value!.isEmpty ? 'Please enter first name' : null,
            ),
            TextFormField(
              controller: lastNameController,
              decoration: const InputDecoration(labelText: 'Last Name'),
              validator: (value) =>
                  value!.isEmpty ? 'Please enter last name' : null,
            ),
            TextFormField(
              controller: emailController,
              decoration: const InputDecoration(labelText: 'Email'),
              validator: (value) {
                if (value == null || value.isEmpty || !value.contains('@')) {
                  return 'Please enter a valid email';
                }
                return null;
              },
            ),
            TextFormField(
              controller: phoneNumberController,
              decoration: const InputDecoration(labelText: 'Phone Number'),
              keyboardType: TextInputType.number, // Use number keyboard
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly, // Only allows digits
                LengthLimitingTextInputFormatter(10), // Limit to 8 characters
              ],
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter your phone number';
                }
                if (value.length != 10) {
                  return 'Phone number must be exactly 10 digits';
                }
                return null;
              },
            ),
            TextFormField(
              controller: addressController,
              decoration: const InputDecoration(labelText: 'Address'),
            ),
            TextFormField(
              controller: cityController,
              decoration: const InputDecoration(labelText: 'City'),
            ),
            TextFormField(
              controller: stateController,
              decoration: const InputDecoration(labelText: 'State'),
            ),
            TextFormField(
              controller: zipCodeController,
              decoration: const InputDecoration(labelText: 'Zip Code'),
            ),
            ElevatedButton(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  updateUserProfile();
                }
              },
              child: const Text('Save'),
            ),
            TextButton(
              onPressed: () {
                setState(() {
                  isEditMode = false;
                });
              },
              child: const Text('Cancel'),
            ),
          ],
        )));
  }
}
