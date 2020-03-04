# README
## We Use Stimulus
------

the three main concepts are :

Controller declarations for READ (this gives you read access to the element)
this is done with attribute `data-controller="hello"`

Data targets for WRITE, this looks like `data-target="hello.name"`

Actions to trigger functions declared like `data-action="click->hello#greet"`
thats called an action descriptor. Click is the event name , hello is the controller identifier, greet is the name of the method to invoke.



SETUP TIDBITS

We use overmind to integrate webpacker dev server and rails. This webpacker server thing that we call in the Procfile is insanely fast at hot reloading your JS wowowo yayayaya.

`OVERMIND_PROCFILE=Procfile`

`overmind start`


Webpacker setup stuff and rails 6 helpful tips 

https://dev.to/vvo/a-rails-6-setup-guide-for-2019-and-2020-hf5



--------

## Seting Up Local    

rails db:create 

rails db:migrate 

