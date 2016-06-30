var express = require('express');
var webApp = express();

webApp.use(express.static(__dirname + '/src'));

//Points to html doc to use when the localhost is loaded?
webApp.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

webApp.listen(3000, function(){
  console.log('web application listening on 3000:');
});