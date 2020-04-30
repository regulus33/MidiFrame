
import 'dart:convert';
import 'package:midiframe_frontend/models/User.dart';
import 'package:flutter/material.dart';
import 'package:midiframe_frontend/services/api.dart';


void main() => runApp(MidiFrame());


class MidiFrame extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'My Http App',
      theme: ThemeData(primaryColor: Colors.blue),
      home: MyListScreen(),
    );
  }
  
}


class MyListScreen extends StatefulWidget {
  @override
  createState() => _MyListScreenState();
}

class _MyListScreenState extends State {
  var users = new List<User>();

  _getUsers() {
    API.getUsers().then((response) {
      print(response);
      setState((){
        Iterable list = json.decode(response.body);
        users = list.map((model) => User.fromJson((model))).toList();
        print(users);
      });
    });
  }

  initState() {
    super.initState();
    _getUsers();
  }
  dispose() {
    super.dispose();
  }

  @override
  build(context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("User List")
      ),
      body: ListView.builder(
        itemCount: users.length,
        itemBuilder: (context, index) {
          return ListTile(title: Text(users[index].name));
        }
      )
    );
  }

}