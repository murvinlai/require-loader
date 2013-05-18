var express = require('express');

var app = express();

app.use(express.static(__dirname + "/public_host1"));

app.all('/', function(req, res){
    res.redirect('/home.html');    
})

module.exports.domain = 'require-loader-test-host1.com'; 
module.exports.app = app;