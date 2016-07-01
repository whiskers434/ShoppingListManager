var express = require('express');
var app = express();
var webApp = require('./webApp.js')(app);
var webService = require('./webService.js')(app);

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/src'));

app.listen(port, function(){
  console.log('web application listening on:' + port);
});