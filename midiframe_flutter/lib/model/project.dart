import 'package:flutter/foundation.dart';

// ? DATA MODELS 
class Project {
  const Project({
    @required this.name,
  }) : assert(name != null);

  final String name;
  

}