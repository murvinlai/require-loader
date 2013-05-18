/*
 Demonstrate how it can help for handling multiple DNS(domains) dynamically with the help of require-loader.
 
 To run this example, you have to change the host file for the domains:
 127.0.0.1 require-loader-test-host1.com
 127.0.0.1 require-loader-test-host2.com
 127.0.0.1 require-loader-test-host3.com
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