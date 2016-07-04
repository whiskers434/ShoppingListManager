var bodyParser = require('body-parser');
var file = require('./fileReadWriter.js');

module.exports = function(webService){
	webService.use(bodyParser.json()); // for parsing application/json
	webService.use(bodyParser.urlencoded({ extended: true })); // for parsing

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
		var listNew = req.body.list;
		console.log(listNew);
		if(listNew != undefined){
			file.ReadListFromFile(listNew, res);
		}
	});

	webService.post('/sendList', function(req, res, next) {
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

	webService.post('/sendListRemove', function(req, res, next) {
	    var listRemove = req.body.list;
		console.log('sendListRemove');
		console.log(listRemove);
		file.RemoveListFromFile(listRemove)
		file.lists.splice(file.lists.indexOf(listRemove),1);
	});
}
