var express = require('express');
var webService = express();
var fs = require('fs');
var builder = require('xmlbuilder');
var parseXMLstring = require('xml2js').parseString;
var bodyParser = require('body-parser');

webService.use(bodyParser.json()); // for parsing application/json
webService.use(bodyParser.urlencoded({ extended: true })); // for parsing

var webServiceUrl = 'http://localhost:';
var webServicePort = '3001';

var products = [];
GetProductListFromFile();
var lists = [];
//GetListsFromFile();
ReadListsFromFiles();

//list object
function listObj(name, items){
	this.name = name;
	this.items = items;
}

//item object
function itemObj(name, quantity){
	this.name = name;
	this.quantity = quantity;
}

function GetProductListFromFile(){
    fs.readFile('src/txt/ProductList.txt', 'utf8', function (err,data) {
	  	if (err) {
	    	return console.log(err);
	  	}
	  	var items = "";
	  	items = data;
	  	products = items.split("\n");
	});
	
};

function ReadListsFromFiles(){
	fs.readdir('src/txt/lists', 'utf8', function (err, files) {
		if (err) {
	    	return console.log(err);
	  	}
		for(i = 0; i < files.length; i++){
			var name = files[i].substring(0,files[i].indexOf('.txt'))
			lists.push(name);
		}
	});
}

function WriteListsToFiles(lists){
	for(var i = 0; i < lists.length; i++){
		WriteListToFile(lists[i]);
	}
	fs.readdir('src/txt/lists', 'utf8', function(err, files) {
		if (err) {
	    	return console.log(err);
	  	}
		console.log('List of files: ' + files);
		for(i = 0; i < files.length; i++){
			for(var ii = 0; ii < lists.length; ii++){
				if(files[i] === (lists[ii].name + ".txt")){
					files.splice(i,1);
					i--;
				}
			}
			
		}
		for(iii = 0; iii < files.length; iii++){
			 fs.unlink('src/txt/lists/' + files[iii], function(err){
		        if (err) {
			    	return console.log(err);
			  	}
          });
		}
	});
}

function RemoveListFromFile(list){
	var name = list + ".txt";
	fs.unlink('src/txt/lists/' + name, function(err){
		if (err) {
			return console.log(err);
		}
    });
}

function ReadListFromFile(list, res){
	var name =  list + '.txt';
	fs.readFile('src/txt/lists/' + name, 'utf8', function (err,data) {
	  	if (err) {
	    	return console.log(err);
	  	}
	  	//console.log("read file test:" + data);
	  	parseXMLstring(data, function (err, result) {
		    //console.log(result);
		    var list = new listObj(result.list.name[0],[]);
		    if(result.list.items[0].item != undefined){
		    for(var i = 0; i < result.list.items[0].item.length; i++){
			    	var item = new itemObj(result.list.items[0].item[i].name[0], result.list.items[0].item[i].quantity[0]);
					if(list.items === undefined){
						list.items = [item];
			  		}else{
			  			list.items.push(item);
			  		}
			  	}
			}
		  	console.log(list);
		    res.send(list);
		    res.end();
		});
	});
}

function WriteListToFile(list){
	var name = list.name + ".txt";

	var xml = builder.create('list');
		xml.ele('name', list.name);
		var items = xml.ele('items');
			for(i = 0; i < list.items.length; i++){
				var item = items.ele('item');
				item.ele('name', list.items[i].name);
				item.ele('quantity', list.items[i].quantity);
			}
		xml.end({ pretty: true});
		 
		//console.log(xml);

	fs.writeFile('src/txt/lists/' + name, xml, 'utf8', function(err) {
		if (err) {
	    	return console.log(err);
	  	}
		console.log('It\'s saved!');
	});
}

webService.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

webService.get('/getProductList', function(req, res, next){
	console.log('getProductList');
	res.send(products);
	res.end();
});

webService.get('/getLists', function(req, res , next){
	console.log('getLists');
	res.send(lists);
	res.end();
});

webService.post('/getList', function(req, res, next){
	console.log('get List');
	console.log(req.body);
	var listNew = req.body.list;
	//var listNew = 'List1';
	console.log('get List');
	console.log(listNew);
	for(i = 0; i < lists.length; i++){
		if(lists[i] == listNew){
			//console.log(ReadListFromFile(lists[i]));
			ReadListFromFile(lists[i], res);
			break;
		}
	}
});

webService.post('/sendList', function(req, res, next) {
    var listNew = req.body;
	console.log('sendList');
	console.log(listNew);
	WriteListToFile(listNew)
	var i = lists.indexOf(listNew.name);
	if(i == -1){
		lists.push(listNew.name);
	}else{
		lists[i] = listNew.name;
	}
    res.end();
});

webService.post('/sendListRemove', function(req, res, next) {
    var listRemove = req.body.list;
	console.log('sendListRemove');
	console.log(listRemove);
	RemoveListFromFile(listRemove)
	lists.splice(lists.indexOf(listRemove),1);
    res.end();
});

webService.listen(3001, function(){
  console.log('web service listening on : 3001');
});