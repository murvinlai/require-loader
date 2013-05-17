/*
 Demonstrate how it can help for handling multiple DNS(domains) dynamically with the help of require-loader.
*/
var express = require('express');
var app = express();
var RL = require("require-loader");


var onDomainChange = function(err, data) {
    if (data.action == 'add') {
        app.use(express.vhost(data.ref.domain, data.ref.app));
    } 
}

var reqLoader = RL.create({path:__dirname + '/hosts-loader', init:true, isWatch:true, onChange:onDomainChange});

var host1 = reqLoader.getMap()['host1.js'];
host1.output();

app.listen(3000);