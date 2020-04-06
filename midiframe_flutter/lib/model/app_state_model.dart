// THIS IS A SAMPLE FILE ONLY. Get the full content at the link above.

import 'package:flutter/foundation.dart' as foundation;

import 'project.dart';
import 'projects_repository.dart';


class AppStateModel extends foundation.ChangeNotifier {
 List<Project> _latestProjects;
//  final _productsInCart = <int, int>{};

 List<Project> getProjects() {
    if (_latestProjects == null) {
      return [];
    }
    return _latestProjects; 

  }

  void loadProjects() {
    _latestProjects = ProjectsRepository.loadProducts();
    notifyListeners();
  }

}