## RAILS credentials.yml.enc, Master Key and all that security Jazz 

The file where you will store all of your credentials is now `config/credentials.yml.enc`

By CREDENTIALS I mean any passwords, secret keys, tokens... all of it. 

So, we have a master key which will unlock this encrypted file. Yay 

You can keep the key in a config folder (dont commit it!) or as an environment 

variable. 
