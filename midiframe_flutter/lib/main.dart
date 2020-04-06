import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';

import './widgets/project_list_tab.dart';
import './widgets/settings_tab.dart';
import './widgets/player_tab.dart';
import 'package:provider/provider.dart';

import 'model/app_state_model.dart';   


void main() {
   SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]);
   
   return runApp(
    ChangeNotifierProvider<AppStateModel>(
      create: (context) => AppStateModel()..loadProjects(),
      child: MidiFrameApp(),
    ),
  );
    
}

// ?the main function of this Class is to initialize the state here? 
class MidiFrameApp extends StatefulWidget {
   @override
  State<StatefulWidget> createState() => _MidiFrameAppState();
}

class _MidiFrameAppState extends State<MidiFrameApp> {
  
  @override
  void initState() {
    super.initState();

  }

  @override
  void dispose() {
    super.dispose();
  }

  Widget build(BuildContext context) {
    return CupertinoApp(
      home: MidiFrameHomePage()
    );
  }


  // FutureBuilder<String>(
  //         // WARNING: home attribute occupies "/" route!
  //         future: locator<UserService>().currentUserToken(),
  //         builder: (context, snapshot) {
  //           if (snapshot.connectionState == ConnectionState.done) {
  //             //until promise is resolved, we do not want to decide/display any screen
  //             final bool isLogged = snapshot.hasData;
  //             return isLogged ? HomeScreen() : SelectTemplateScreen();
  //           } else {
  //             // still getting current user

  //             return const LoadingIndicator();
  //         }
  //         }),

}

class MidiFrameHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CupertinoTabScaffold(
      tabBar: CupertinoTabBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(CupertinoIcons.home),
            title: Text('Products'),
          ),
          BottomNavigationBarItem(
            icon: Icon(CupertinoIcons.search),
            title: Text('Search'),
          ),
          BottomNavigationBarItem(
            icon: Icon(CupertinoIcons.shopping_cart),
            title: Text('Cart'),
          ),
        ],
      ),
      tabBuilder: (context, index) {
        switch (index) {
          case 0:
            return CupertinoTabView(builder: (context) {
              return CupertinoPageScaffold(
                child: ProjectListTab(),
              );
            });
          case 1:
            return CupertinoTabView(builder: (context) {
              return CupertinoPageScaffold(
                child: PlayerTab(),
              );
            });
          case 2:
            return CupertinoTabView(builder: (context) {
              return CupertinoPageScaffold(
                child: SettingsTab(),
              );
            });
        }
      },
    );
  }
}