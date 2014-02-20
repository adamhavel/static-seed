var express = require('express');
var path = require('path');
var app = express();
var http = require('http');
app.use(express.compress());
app.use(express.static(path.resolve('public')));
app.listen(80);
console.log('Listening on port 80');