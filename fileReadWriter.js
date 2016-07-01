var fs = require('fs');
var builder = require('xmlbuilder');
var parseXMLstring = require('xml2js').parseString;

module.exports = {
	products:  [null],
	lists: [null],

	GetProductListFromFile: function (res){
	    fs.readFile('src/txt/ProductList.txt', 'utf8', function (err,data) {
		  	if (err) {
		    	return console.log(err);
		  	}
		  	var items = "";
		  	items = data;
		  	products = items.split("\n");
		  	res.send(products);
			res.end();
		});
	},

	ReadListsFromFiles: function (res){
		var files = fs.readdirSync('src/txt/lists');
		this.lists = [];
	  	if(files != undefined){
			for(i = 0; i < files.length; i++){
				var name = files[i].substring(0,files[i].indexOf('.txt'))
				if(this.lists === undefined){
					this.lists = [name];
				}else{
					this.lists.push(name);
				}
			}
		}
		res.send(this.lists);
		res.end();
		/*
		fs.readdir('src/txt/lists', 'utf8', function (err, files) {
			if (err) {
				console.log('Error reading directory: src/txt/lists');
				console.log(err);
		    	return; 
		  	}
		  	this.lists = [];
		  	if(files != undefined){
				for(i = 0; i < files.length; i++){
					var name = files[i].substring(0,files[i].indexOf('.txt'))
					if(this.lists === undefined){
						this.lists = [name];
					}else{
						this.lists.push(name);
					}
				}
			}
			res.send(lists);
			res.end();
		});
		*/
	},

	WriteListsToFiles: function (lists){
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
	},

	RemoveListFromFile: function (list){
		var name = list + ".txt";
		fs.unlink('src/txt/lists/' + name, function(err){
			if (err) {
				return console.log(err);
			}
	    });
	},

	ReadListFromFile: function (list, res){
		var name =  list + '.txt';
		fs.readFile('src/txt/lists/' + name, 'utf8', function (err,data) {
		  	if (err) {
		    	return console.log(err);
		  	}
		  	console.log("read file test:" + data);
		  	parseXMLstring(data, function (err, result) {
			    //console.log(result);
			    var list = { name: result.list.name[0], items: []};
			    if(result.list.items[0].item != undefined){
			    for(var i = 0; i < result.list.items[0].item.length; i++){
				    	var item = { name: result.list.items[0].item[i].name[0], quantity: result.list.items[0].item[i].quantity[0]};
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
	},

	WriteListToFile: function (list){
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
}