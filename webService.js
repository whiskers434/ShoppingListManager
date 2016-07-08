var bodyParser = require('body-parser');
var file = require('./fileReadWriter.js');
var db = require('./mongoDBReadWriter.js');

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
		db.findProducts(db.database, function(products) {
			//console.log(products);
			res.send(products);
			res.end();
		});
	});

	app.get('/getLists', function(req, res , next){
		//console.log('getLists');
		db.findLists(db.database, function(listNames){
			//console.log(listNames);
			res.send(listNames);
			res.end();
		});
	});

	app.get('/getListsOfIndex/:page', function(req, res , next){
		//console.log('getLists');
		var page = req.params.page;
		var endIndex = page*5;
		var startIndex = endIndex - 5;
		db.findListsOfIndex(db.database, startIndex, endIndex, function(listNames){
			//console.log(listNames);
			res.send(listNames);
			res.end();
		});
	});

	app.get('/getNumOfLists', function(req, res , next){
		//console.log('getNumOfLists');
		db.getNumberOfLists(db.database, function(numOfLists){
			//console.log(numOfLists);
			res.send(numOfLists);
			res.end();
		});
	});

	app.get('/getList/:listName', function(req, res, next){
		var listName = req.params.listName;
		//console.log('get List');
		//console.log(listName);
		if(listName != undefined){
			db.findList(db.database, listName, function(list) {
				//console.log(list);
				res.send(list);
		    	res.end();	
			});
			
		}
	});

	app.post('/writeList', function(req, res, next) {
	    var newlist = req.body.list;
	    var oldListName = req.body.oldName;
		//console.log('sendList');
		//console.log(listNew.name);
		//console.log(listOld);
		db.saveList(newlist, oldListName);
	});

	app.post('/deleteList', function(req, res, next) {
	    var listNameToRemove = req.body.list;
		//console.log('sendListRemove');
		//console.log(listRemove);
		db.removeList(db.database, listNameToRemove)
	});
}
