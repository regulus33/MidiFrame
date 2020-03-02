# README
## Javascript

Each screen has its own 1 to 1 JS file. These files are for UI updates only. All business logic having to do with midi parsing will be in Service Classes and isolated from the dom specific code. 

This is an important point because each file overwrites `window.onload` on each page visit with whatever new JS file is fetched and run or pulled from the cache. This is an attempt to synchronize the JS with the request response cycle of rails and make things as easy for us as possible.

------

We use overmind to integrate webpacker dev server and rails. This webpacker server thing that we call in the Procfile is insanely fast at hot reloading your JS wowowo yayayaya.

`OVERMIND_PROCFILE=Procfile`

`overmind start`


Webpacker setup stuff and rails 6 helpful tips 

https://dev.to/vvo/a-rails-6-setup-guide-for-2019-and-2020-hf5


JS plan, each js file listed here: 

## 1 React container component: 

only one stateful component. no business logic, just render method and componentDidMount.

## 2 Presentational component: 

video (videojs wrapper), notetextfield, videoselector (the dropdown)

Helpers and logic classes: a class that parses each incoming midi message and adds it to a hash 
flat as possible 

```json
  '123.56' : '',//this value is blank because no notetextfield value has been modded for it
  '124.57' : '3:56.78'//this is the tiestamp and the channel, see? 
```

That's the main function but then we also have:

1. randomize timestamps, 
2. hotkey to slightly nudge the timestamp field back or forward. 
3. highlighting the textfield to isolate randomization to one note.  
4. recording midi 
5. isolating incoming midi to the selected channel    
6. hotkeys to switch channel, keyboard wil be more effective for this.   
