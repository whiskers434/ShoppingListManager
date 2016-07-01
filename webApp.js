var express = require('express');
var webApp = express();

webApp.use(express.static(__dirname + '/src'));

var port = process.env.PORT || 3000;

//Points to html doc to use when the localhost is loaded?
webApp.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

webApp.listen(port, function(){
  console.log('web application listening on:' + port);
});