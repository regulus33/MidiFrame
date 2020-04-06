// THIS IS A SAMPLE FILE. Get the full content at the link above.

import 'project.dart';

class ProjectsRepository {
 static const _allProjects = <Project>[
   Project(
     name: 'Graphical User Man',
   ),
   Project(
     name: 'Vanilla',
   ),
   Project(
     name: 'DAMN',
   ),
   // THIS IS A SAMPLE FILE. Get the full content at the link above.
 ];

 static List<Project> loadProducts() {
    return _allProjects;
 }
}