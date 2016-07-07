var bodyParser = require('body-parser');
var file = require('./fileReadWriter.js');
var db = require('./mongoDBtest.js');

file.GetProductListFromFile();
file.GetListsFromDir();

module.exports = function(app){
	app.use(bodyParser.json()); // for parsing application/json
	app.use(bodyParser.urlencoded({ extended: true })); // for parsing

	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});

	app.get('/getProductList', function(req, res, next){
		//console.log('getProductList');
		//console.log(db.getProducts());
		res.send(db.getProducts());
		res.end();
	});

	app.get('/getLists', function(req, res , next){
		//console.log('getLists');
		//console.log(db.getLists());
		res.send(db.getLists());
		res.end();
	});

	app.get('/getList/:listName', function(req, res, next){
		var listName = req.params.listName;
		//console.log('get List');
		//console.log(listName);
		if(listName != undefined){
			res.send(db.getList(listName));
		    res.end();	
		}
	});

	app.post('/writeList', function(req, res, next) {
	    var newlist = req.body.list;
	    var oldListName = req.body.oldName;
		//console.log('sendList');
		//console.log(listNew.name);
		//console.log(listOld);
		db.saveList(newlist, oldListName);
		/*
		file.WriteListToFile(listNew)
		var i = file.lists.indexOf(listNew.name);
		if(i == -1){
			file.lists.push(listNew.name);
			if(listOld != ""){
				file.RemoveListFromFile(listOld)
				file.lists.splice(file.lists.indexOf(listOld),1);
			}
		}
		*/
	});

	app.post('/deleteList', function(req, res, next) {
	    var listNameToRemove = req.body.list;
		//console.log('sendListRemove');
		//console.log(listRemove);
		db.deleteList(listNameToRemove);
		//file.DeleteListFile(listRemove)
		//file.lists.splice(file.lists.indexOf(listRemove),1);
	});
}
