/*
* That's the implementation of require-loader
*/

var fs = require('fs');
var util = require('util');

function ReqManager(options) {
    this.path = options.path || "./";
    this.map = [];
    this.resolve_names = [];
}

ReqManager.prototype.setPath = function(path) {
    this.path = path;   
}

// not necessary
ReqManager.prototype.add = function(filename) {
    this.map[filename] = require(filename);
    this.resolve_names[filename] = require(filename);
    return this.map[filename];
}

ReqManager.prototype.remove = function(filename) {
    delete require.cache[this.resolve_names[filename]];
    delete this.resolve_names[filename];
    delete this.map[filename];
}

ReqManager.prototype.getMap = function() {
    return this.map;
}

ReqManager.prototype.autoStart = function() {
    // get all files from the directory
    var that = this;
    fs.readdirSync(that.path, function(err, filename){
        that.add(filename);
    });
}

ReqManager.prototype.watch = function() {
    var that = this;
    fs.watch(that.path, function(event, filename){
        console.log("Filename: " + filename);
        if (that.map[filename]) {
            // exist in map.  check if the file still exist. 
            // if doesn't exist anymore, then remove from require cache.
            if (! fs.existsSync(that.path + "/" + filename)) {
                that.remove(filename);
            } 
        } else {
            // add.
            that.add(filename);
        }
    });
}

module.exports.create = function(options) {
    var requireManager = new ReqManager(options);
    if (options.autoStart) {
        requireManager.autoStart();
    }
    return requireManager;
}

