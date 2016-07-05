var fs = require('fs');
var builder = require('xmlbuilder');
var parseXMLstring = require('xml2js').parseString;

module.exports = {
	products:  [null],
	lists: [null],

	GetProductListFromFile: function (res){
	    var items = fs.readFileSync('src/txt/ProductList.txt', 'utf8');
		this.products = items.split("\n");
		return this.products;
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
		return this.lists;
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
		var data = fs.readFile('src/txt/lists/' + name, 'utf8');
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