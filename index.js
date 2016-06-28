var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var builder = require('xmlbuilder');
var parseXMLstring = require('xml2js').parseString;
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/src'));

//Points to html doc to use when the localhost is loaded?
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

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

function GetListsFromFile(){
	fs.readFile('src/txt/Lists.txt', 'utf8', function (err,data) {
	  	if (err) {
	    	return console.log(err);
	  	}
	  	//console.log("data");
	  	//console.log(data);
	  	var string = "";
	  	var strings = [];
	  	string = data;
	  	if(string != "")
	  	{
		  	strings = string.split("\n");
		  	//console.log("strings");
		  	//console.log(strings);
		  	for(var i = 0; i < (strings.length-1); i++){
		  		var list = JSON.parse(strings[i]);
		  		//console.log("list");
		  		//console.log(list);
		  		if(lists === undefined){
					lists = [list];
		  		}else{
		  			lists.push(list);
		  		}
		  	}
	    }
	});
}

function WriteListsToFile(lists){
	var strings = [];
	var string = "";

	for(var i = 0; i < lists.length; i++){
		strings.push(JSON.stringify(lists[i]));
	}

	//console.log(strings);

	for(var i = 0; i < strings.length; i++){
		string += (strings[i] + "\n");
	}

	console.log(string);

	fs.writeFile('src/txt/Lists.txt', string, 'utf8', function (err) {
		if (err) throw err;
		console.log('It\'s saved!');
	});
}

function ReadListsFromFiles(){
	fs.readdir('src/txt/lists', 'utf8', function (err, files) {
		if (err) throw err;
		console.log('List of files: ' + files);
		for(i = 0; i < files.length; i++){
			ReadListFromFile(files[i]);
		}
	});
}

function WriteListsToFiles(lists){
	for(var i = 0; i < lists.length; i++){
		WriteListToFile(lists[i]);
	}
	fs.readdir('src/txt/lists', 'utf8', function(err, files) {
		if (err) throw err;
		console.log('List of files: ' + files);
		for(i = 0; i < files.length; i++){
			for(var ii = 0; ii < lists.length; ii++){
				if(file[i] === (lists[ii].name + ".txt")){
					file.splice(i,1);
					i--;
					break;
				}
			}
			
		}
		/*
		for(iii = 0; iii < files.length; iii++){
			 fs.unlink('src/txt/lists/' + files[iii], function(err){
               if (err) throw err;
          });
		}
		*/
	});
}

function ReadListFromFile(name){
	fs.readFile('src/txt/lists/' + name, 'utf8', function (err,data) {
	  	if (err) {
	    	return console.log(err);
	  	}
	  	console.log("read file test:" + data);
	  	parseXMLstring(data, function (err, result) {
		    console.log(result);
		    var list = new listObj(result.list.name[0],[]);
		    for(var i = 0; i < result.list.items[0].item.length; i++){
		    	var item = new itemObj(result.list.items[0].item[i].name[0], result.list.items[0].item[i].quantity[0]);
				if(list.items === undefined){
					list.items = [item];
		  		}else{
		  			list.items.push(item);
		  		}
		  	}
		  	console.log(list);
		    if(lists === undefined){
				lists = [list];
	  		}else{
	  			lists.push(list);
	  		}
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
		 
		console.log(xml);

	fs.writeFile('src/txt/lists/' + name, xml, 'utf8', function(err) {
		if (err) throw err;
		console.log('It\'s saved!');
	});
}

http.listen(port, function(){
  console.log('listening on *:' + port);
});

app.get('/getProductList', function(req, res){
	console.log('getProductList');
	res.send(products);
});

app.get('/getLists', function(req, res){
	console.log('getLists');
	res.send(lists);
});

app.post('/sendLists', function(req, res) {
    console.log(req.body);
    var listsNew = req.body;
	console.log('sendLists');
	console.log(listsNew);
	WriteListsToFiles(listsNew)
	lists = listsNew;
    res.end();
});