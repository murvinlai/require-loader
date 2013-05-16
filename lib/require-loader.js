/*
* That's the implementation of require-loader
*/

var fs = require('fs');
var util = require('util');

function ReqManager(options) {
    this.path = options.path || "./";
    this.watch = options.watch || true;
}

ReqManager.prototype.setPath = function(path) {
    this.path = path;   
}

// not necessary
ReqManager.prototype.require = function(moduleName) {
    return require(moduleName);
}

ReqManager.prototype.remove = function(moduleName) {
    
}

ReqManager.prototype.autoStart = function() {
    
}

module.exports.create = function(options) {
    var requireManager = new ReqManager(options);
    if (options.autoStart) {
        requireManager.start();
    }
    return requireManager;
}

