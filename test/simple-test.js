var rl = require("../lib/require-loader.js");

// Set the absolute path of the directory to watch, and start initial function right away.
var rmanager = rl.create({path:__dirname + '/loader', init:true});

// get the map
var map = rmanager.getMap();

// check the map keys. 
for (var m in map) {
    console.log("MAP: " + m + " V" + map[m]);
}

// test run it. 
var t1 = map['test-1.js'];
t1.run();

