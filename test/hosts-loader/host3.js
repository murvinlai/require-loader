var express = require('express');

var app = express();

app.all('/', function(req, res){
    res.send('HOST 3');
})

module.exports.domain = 'require-loader-test-host3.com';
module.exports.app = app;