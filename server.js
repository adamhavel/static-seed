var express = require('express'),
    compression = require('compression'),
    path = require('path'),
    app = express();

app.use(compression());
app.use(express.static(path.resolve(process.argv[2] === 'dist' ? 'build' : 'public')));
app.listen(3000);
console.log('Listening on port 3000');