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