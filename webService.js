var bodyParser = require('body-parser');
var file = require('./fileReadWriter.js');

file.GetProductListFromFile();
file.ReadListsFromFiles();

module.exports = function(app){
	app.use(bodyParser.json()); // for parsing application/json
	app.use(bodyParser.urlencoded({ extended: true })); // for parsing

	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});

	app.get('/getProductList', function(req, res, next){
		console.log('getProductList');
		res.send(file.products);
		res.end();
	});

	app.get('/getLists', function(req, res , next){
		console.log('getLists');
		res.send(file.lists);
		res.end();
	});

	app.get('/getList', function(req, res, next){
		var listName = req.query.list;
		console.log('get List');
		console.log(listName);
		if(listName != undefined){
			res.send(file.ReadListFromFile(listName));
		    res.end();	
		}
	});

	app.post('/writeList', function(req, res, next) {
	    var listNew = req.body.list;
	    var listOld = req.body.oldName;
		console.log('sendList');
		console.log(listNew.name);
		console.log(listOld);
		file.WriteListToFile(listNew)
		var i = file.lists.indexOf(listNew.name);
		if(i == -1){
			file.lists.push(listNew.name);
			if(listOld != ""){
				file.RemoveListFromFile(listOld)
				file.lists.splice(file.lists.indexOf(listOld),1);
			}
		}
	});

	app.post('/deleteList', function(req, res, next) {
	    var listRemove = req.body.list;
		console.log('sendListRemove');
		console.log(listRemove);
		file.RemoveListFromFile(listRemove)
		file.lists.splice(file.lists.indexOf(listRemove),1);
	});
}
