var express = require('express');
var webService = express();
var bodyParser = require('body-parser');
var file = require('./fileReadWriter.js');

webService.use(bodyParser.json()); // for parsing application/json
webService.use(bodyParser.urlencoded({ extended: true })); // for parsing

//var port = process.env.PORT || 3001;
var port = 3001

webService.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

webService.get('/getProductList', function(req, res, next){
	console.log('getProductList');
	file.GetProductListFromFile(res);
});

webService.get('/getLists', function(req, res , next){
	console.log('getLists');
	file.ReadListsFromFiles(res);
});

webService.post('/getList', function(req, res, next){
	console.log('get List');
	console.log(req.body);
	var listNew = req.body.list;
	//var listNew = 'List1';
	console.log('get List');
	console.log(listNew);
	if(listNew != undefined){
		file.ReadListFromFile(listNew, res);
	}
});

webService.post('/sendList', function(req, res, next) {
    var listNew = req.body;
	console.log('sendList');
	console.log(listNew);
	file.WriteListToFile(listNew)
	var i = file.lists.indexOf(listNew.name);
	if(i == -1){
		file.lists.push(listNew.name);
	}else{
		file.lists[i] = listNew.name;
	}
    res.end();
});

webService.post('/sendListRemove', function(req, res, next) {
    var listRemove = req.body.list;
	console.log('sendListRemove');
	console.log(listRemove);
	file.RemoveListFromFile(listRemove)
	file.lists.splice(file.lists.indexOf(listRemove),1);
    res.end();
});

webService.listen(port, function(){
  console.log('web service listening on :'+ port);
});