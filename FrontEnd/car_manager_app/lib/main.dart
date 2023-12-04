import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'views/create_account_page.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'views/home_page.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Login Screen',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';

void _submitLogin() async {
  if (_formKey.currentState!.validate()) {
    
    _formKey.currentState!.save();

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Processing Data')),
    );

    var url = Uri.parse('http://10.0.2.2:5041/userapi/user/login');

    try {
      var response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: json.encode({'email': _email, 'password': _password}),
      );

      if (response.statusCode == 200) {
        String? token = extractTokenFromCookie(response.headers['set-cookie']);
        if (token.isNotEmpty) {
          const storage = FlutterSecureStorage();
          await storage.write(key: 'jwt_token', value: token);

          // Navigate to home page
        if (!mounted) return;
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const HomePage(username: "Alexander")),
        );
        } else {
          showSnackBar('No token found in response.');
        }
      } else {
        showSnackBar('Login failed: ${response.body}');
      }
    } catch (e) {
      showSnackBar('An error occurred: $e');
    }
  }
}

void showSnackBar(String message) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text(message)),
  );
}


String extractTokenFromCookie(String? cookie) {
  if (cookie == null) return '';
  return cookie
      .split(';')
      .firstWhere((item) => item.trim().startsWith('token='),
          orElse: () => '')
      .split('=')
      .last;
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login Page'),
      ),  
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            // Add this
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                const Text(
                  'Welcome to Car Manager!',
                  style: TextStyle(fontSize: 24.0),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 40.0),
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value!.isEmpty || !value.contains('@')) {
                      return 'Please enter a valid email';
                    }
                    return null;
                  },
                  onSaved: (value) => _email = value!,
                ),
                const SizedBox(height: 20.0),
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                  ),
                  obscureText: true,
                  validator: (value) {
                    if (value!.isEmpty || value.length < 8) {
                      return 'Password must be at least 8 characters long';
                    }
                    return null;
                  },
                  onSaved: (value) => _password = value!,
                ),
                const SizedBox(height: 20.0),
                ElevatedButton(
                  onPressed: _submitLogin,
                  child: const Text('Login'),
                ),
                TextButton(
                  onPressed: () {
                    // Navigate to password reset page
                  },
                  child: const Text('Forgot Password?'),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => const CreateAccountPage(),
                      ),
                    );
                  },
                  child: const Text("Don't have an account? Create one."),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
