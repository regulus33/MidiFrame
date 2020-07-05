import 'dart:async';
import 'package:http/http.dart' as http;

const baseUrl = "http://localhost:3000/";

class API {
  static Future getUsers() {
    var url = baseUrl + "/projects";
    return http.get(url);
  }
}
