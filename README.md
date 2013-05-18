require-loader
==============

Watch the specified directory and dynamically add/remove module when there is any change.   [require-loader] is local to the module. 


-------------


## Purpose
To allow dynamically add / remove module in a simple way. 
When new file is put into the directory, it uses "require()" to add module as usual, and it can be referenced in the [require-loader] map. 
When file is removed from the directory, it will be removed from require.cache and the [require-loader] map. 

[require-loader] is local to the module implementing it.  Therefore you can set up require-loader in 'test-a.js' and 'test-b.js' watching on different directories, and not interferring each other.


## Installation
    $ npm install require-loader


## Quick Start

Assume you have a folder 'loader' you want to watch for adding/removing module, and you already have /loader/test-1.js , in your test.js file, you can:


```js
/* test-.js */
var rl = require("require-loader").create({path:__dirname + '/loader', init:true});

var t1 = rl.getMap()['test-1.js'];
t1.run(); // assume run() is export from test-1.js

```

## Features & Options

You can pass in the following options when you require the 'require-loader':

```js
var options = {
    path    :   String,     /* The full path of the directory you want to watch, default to './' */
    init    :   Boolean,    /* To run an initial load from the directory or not, default to false */
    isWatch :   Boolean,    /* To watch the directory or not.  Default to true */
    onChange:   function(err, data){}    /* Call when any module is added or removed.  It will data as: {action:String, filename:String, resolve_name:String, ref:Object   }, action is either "add" or "remove", ref is the required Module just added. */
}
```

Example: 

```js
var rl = require("../lib/require-loader.js");

var onChange = function(err, data) {
        console.log("call back: " + JSON.stringify(data));
        if (data.action == 'add') {
            data.ref.run();
        }
}

// Set the absolute path of the directory to watch, and start initial function right away.
var rmanager = rl.create({path:__dirname + '/simple-folder', init:true, onChange:onChange});

// get the map
var map = rmanager.getMap();

// check the map keys. 
for (var m in map) {
    console.log("MAP: " + m + " V" + map[m]);
}

// test run it. 
var t1 = map['test-1.js'];
t1.run();

```


## Use cases

One of the use cases is for loading multiple configs for different domains from a directory. 
See test example "hosts.js". It uses express.js and load different website "app" from the hosts-loader folder.

```js
var express = require('express');
var app = express();
var RL = require("require-loader");

var onDomainChange = function(err, data) {
    if (data.action == 'add') {
        // data.ref is the reference of the app object.
        app.use(express.vhost(data.ref.domain, data.ref.app));
    } 
}

// uses require-loader to watch hosts-loader folder and load the different apps to the main app server. 
var reqLoader = RL.create({path:__dirname + '/hosts-loader', init:true, isWatch:true, onChange:onDomainChange});

// testing for output.
var host1 = reqLoader.getMap()['host1.js'];
host1.output();

app.listen(3000);
```
