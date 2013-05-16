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

// Add filename (module)
ReqManager.prototype.add = function(filename) {
    this.map[filename] = require(filename);
    this.resolve_names[filename] = require(filename);
    return this.map[filename];
}

// remove filename (module)
ReqManager.prototype.remove = function(filename) {
    delete require.cache[this.resolve_names[filename]];
    delete this.resolve_names[filename];
    delete this.map[filename];
}

// return the require map;
ReqManager.prototype.getMap = function() {
    return this.map;
}

/*
* Initial module(s) include
*/
ReqManager.prototype.init = function() {
    // get all files from the directory
    var that = this;
    fs.readdirSync(that.path, function(err, filename){
        that.add(filename);
    });
}

/*
* Watch changes in folder. 
*/
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

/*
* Function to create the ReqManager object. 
* options: {path: {String, default:'./'}, init: Boolean }
*/
module.exports.create = function(options) {
    var requireManager = new ReqManager(options);
    if (options.init) {
        requireManager.init();
    }
    return requireManager;
}

