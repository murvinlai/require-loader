/*
* That's the implementation of require-loader
*/

var fs = require('fs');
var util = require('util');

function ReqManager(options) {
    this.path = options.path || "./";
    this.isWatch = options.isWatch || true;
    this.map = [];
    this.resolve_names = [];
    this.onChange = options.onChange || function() {};
}

ReqManager.prototype.setPath = function(path) {
    this.path = path;   
}

// Add filename (module)
ReqManager.prototype.add = function(filename) {
    if (fs.statSync(this.path + "/" + filename).isFile()) {
        this.map[filename] = require(this.path + "/" + filename);
        this.resolve_names[filename] = require.resolve(this.path + "/" + filename);
        this.onChange(null, {action:'add', filename:filename, resolve_name:this.resolve_names[filename], ref:this.map[filename]});
        return this.map[filename];
    } else {
        return {};
    }
}

// remove filename (module)
ReqManager.prototype.remove = function(filename) {
    var resolve_names = this.resolve_names[filename];
    delete require.cache[this.resolve_names[filename]];
    delete this.resolve_names[filename];
    delete this.map[filename];
    this.onChange(null, {action:'remove', filename:filename, resolve_name:resolve_names});
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
}

/*
* Watch changes in folder. 
*/
ReqManager.prototype.watch = function() {
    var that = this;
    fs.watch(that.path, function(event, filename){
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
* options: {path: {String, default:'./'}, init: Boolean, onChange: function(err,data){}  }
*/
module.exports.create = function(options) {
    var requireManager = new ReqManager(options);
    if (options.init) {
        requireManager.init();
    }
    if (requireManager.isWatch) {
        requireManager.watch();
    }
    return requireManager;
}

