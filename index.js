var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.use(express.static(__dirname + '/src'));

//Points to html doc to use when the localhost is loaded?
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var products = [];
products = GetProductListFromFile();
var lists = [];
lists = GetListsFromFile();

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

	fs.writeFile('src/txt/Lists.txt', string, 'utf8', (err) => {
	  if (err) throw err;
	  console.log('It\'s saved!');
	});
}

	io.on("connect", function(socket){
	console.log("A user has connected...");

	socket.on("disconnect", function(){
		console.log("A user has disconnected...");
	});

	socket.on("getProductList", function() {
		//console.log("products");
		//console.log(products);
		io.emit("ReceiveProductList", products);
	});

	socket.on("getLists", function() {
		
		//console.log("lists");
		//console.log(lists);
		io.emit("ReceiveList", lists);
	});

	socket.on("ReceiveLists", function(listsNew) {
		//console.log("Received Lists");
		//console.log(lists);
		WriteListsToFile(listsNew);
		lists = listsNew;
	});
 });

http.listen(3000, function(){
  console.log('listening on *:3000');
});