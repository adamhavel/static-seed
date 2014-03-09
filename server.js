var express = require('express'),
    path = require('path'),
    app = express();

app.use(express.compress());
app.use(express.static(path.resolve('public')));
app.listen(80);
console.log('Listening on port 80');