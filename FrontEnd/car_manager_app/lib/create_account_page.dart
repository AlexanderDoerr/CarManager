import 'package:intl/intl.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';



class CreateAccountPage extends StatefulWidget {
  const CreateAccountPage({super.key});

  @override
  _CreateAccountPageState createState() => _CreateAccountPageState();
}

class _CreateAccountPageState extends State<CreateAccountPage> {
  final _formKey = GlobalKey<FormState>();
  // Initialize variables for each form field
  String firstName = '';
  String lastName = '';
  String dateOfBirth = '';
  String email = '';
  String phoneNumber = '';
  String password = '';

  final TextEditingController _dateController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();

  // Function to handle form submission
  void _submitCreateAccount() async {
    if (_formKey.currentState!.validate()) {
      // Save the form
      _formKey.currentState!.save();

      // API call logic here...
      var url = Uri.parse('http://10.0.2.2:5041/userapi/user/register');

      try {
        var response = await http.post(
          url,
          headers: {"Content-Type": "application/json"},
          body: json.encode({
            'FirstName': firstName,
            'LastName': lastName,
            'DateOfBirth': dateOfBirth,
            'Email': email,
            'PhoneNumber': phoneNumber,
            'Password': password,
            // Add other fields similarly
          }),
        );

        if (response.statusCode == 200) {
          // Handle successful account creation
        } else {
          throw Exception('Failed to create account');
        }
      } catch (e) {
        print('Caught error: $e');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create an Account'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                // Add TextFormField widgets for each form field
                // Example for FirstName:
                const SizedBox(height: 10.0),
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'First Name',
                    border: OutlineInputBorder(),
                  ),
                  onSaved: (value) => firstName = value!,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your first name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20.0),
/**************************************************************************************************************************/
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Last Name',
                    border: OutlineInputBorder(),
                  ),
                  onSaved: (value) => lastName = value!,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your last name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20.0),
/**************************************************************************************************************************/
                TextFormField(
                  controller: _dateController,
                  decoration: const InputDecoration(
                    labelText: 'Date of Birth',
                    border: OutlineInputBorder(),
                    hintText: 'YYYY-MM-DD', // Hint text for the format
                  ),
                  readOnly: true, // Makes the field read-only
                  onTap: () async {
                    DateTime? pickedDate = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now(),
                      firstDate: DateTime(1900), // Adjust as per your requirement
                      lastDate: DateTime.now(),
                    );

                    if (pickedDate != null) {
                      String formattedDate = DateFormat('yyyy-MM-dd').format(pickedDate);
                      setState(() {
                        _dateController.text = formattedDate; // Set the value of the text field.
                        dateOfBirth = formattedDate; // Save the value in your variable
                      });
                    }
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your date of birth';
                    }
                    // Additional validation for date format can be added here if needed
                    return null;
                  },
                ),
                const SizedBox(height: 20.0),
/**************************************************************************************************************************/
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(),
                  ),
                  onSaved: (value) => email = value!,
                  validator: (value) {
                    if (value == null || value.isEmpty || !value.contains('@')) {
                      return 'Please enter a valid email';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20.0),
/**************************************************************************************************************************/
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Phone Number',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number, // Use number keyboard
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly, // Only allows digits
                    LengthLimitingTextInputFormatter(10), // Limit to 8 characters
                  ],
                  onSaved: (value) => phoneNumber = value!,
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
                const SizedBox(height: 20.0),

/**************************************************************************************************************************/
                // Password TextFormField
                TextFormField(
                  controller: _passwordController,
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                  ),
                  obscureText: true, // Hides the password
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your password';
                    }
                    String pattern = r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$';
                    if (!RegExp(pattern).hasMatch(value)) {
                      return 'Password must be at least 8 characters, include an uppercase letter, a number and a special character';
                    }
                    return null;
                  },
                  onSaved: (value) => password = value!,
                ),
                const SizedBox(height: 20.0),

                // Confirm Password TextFormField
                TextFormField(
                  controller: _confirmPasswordController,
                  decoration: const InputDecoration(
                    labelText: 'Confirm Password',
                    border: OutlineInputBorder(),
                  ),
                  obscureText: true, // Hides the password
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please confirm your password';
                    }
                    if (value != _passwordController.text) {
                      return 'Passwords do not match';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20.0),
/**************************************************************************************************************************/
                // Submit Button
                ElevatedButton(
                  onPressed: _submitCreateAccount,
                  child: const Text('Create Account'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
