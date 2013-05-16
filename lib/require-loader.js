/*
* That's the implementation of require-loader
*/

var fs = require('fs');
var util = require('util');

function ReqManager(options) {
    this.path = options.path || "./";
    this.isWatch = options.watch || true;
    this.map = [];
    this.resolve_names = [];
}

ReqManager.prototype.setPath = function(path) {
    this.path = path;   
}

// Add filename (module)
ReqManager.prototype.add = function(filename) {
    this.map[filename] = require(this.path + "/" + filename);
    this.resolve_names[filename] = require.resolve(this.path + "/" + filename);
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
    var dir = fs.readdirSync(this.path);
    
    for (var i=0; i<dir.length; i++) {
        this.add(dir[i]);
    }
    
    if (this.isWatch) {
        this.watch();
    }
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

