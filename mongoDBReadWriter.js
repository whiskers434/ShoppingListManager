var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://admin:P4$$w0rd@ds017185.mlab.com:17185/shopping_list_manager';
//var url = 'mongodb://localhost:27017/shopping_list_manager';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  module.exports.database = db;
});

module.exports = {
	database: null,

	findProducts: function(db, callback) {
	   var cursor =db.collection('productList').find();
	   var products = [];
	   cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	         //console.dir(doc);
	         //console.dir(doc.product.product);
	         if(products === undefined){
	         	products = [doc.product];
	         }else{
	         	products.push(doc.product.product);
	         }
	      } else {
	         callback(products);
	      }
	   });
	},

	findLists: function(db, callback) {
	   var cursor =db.collection('lists').find();
	   var listNames = [];
	   cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	         //console.dir(doc);
	         //console.dir(doc.list.name);
	         if(listNames === undefined){
	         	listNames = [doc.list.name];
	         }else{
	         	listNames.push(doc.list.name);
	         }
	      } else {
	      	//console.log(listNames);
	      	callback(listNames);
	      }
	   });
	},

	findListsOfIndex: function(db, startIndex, endIndex, callback) {
		var options = {
		    "limit": startIndex-endIndex,
		    "skip": startIndex
		}
	   var cursor =db.collection('lists').find({},options).sort({"list.name": 1});
	   var listNames = [];
	   cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	         //console.dir(doc);
	         //console.dir(doc.list.name);
	         if(listNames === undefined){
	         	listNames = [doc.list.name];
	         }else{
	         	listNames.push(doc.list.name);
	         }
	      } else {
	      	//console.log(listNames);
	      	callback(listNames);
	      }
	   });
	},

	findList: function(db, listName, callback) {
	   var cursor =db.collection('lists').find({"list.name": listName});
	   var list = {};
	   cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	         //console.dir(doc);
	         //console.dir(doc.list);
	         list = doc.list;
	      } else {
	         callback(list);
	      }
	   });
	},

	insertList: function(db, list, callback) {
	   db.collection('lists').insertOne( {
	   	list
	   }, function(err, result) {
	    assert.equal(err, null);
	    //console.log("Inserted " + list.name + " into the lists collection.");
	    callback();
	  });
	},

	updateList: function(db, listName, list, callback) {
	   db.collection('lists').updateOne({ "list.name": listName},
	   {
	   	$set: {list},
	   	$currentDate: { "lastModified": true}
	   }, function(err, results) {
	      	assert.equal(err, null);
	      	//console.log("Update a list into the lists collection.");
	      	callback();
	   });
	},

	saveList: function(newList, oldListName){
		if(oldListName != ""){
			this.updateList(this.database, oldListName, newList, function() {});
		}else{
			this.insertList(this.database, newList, function() {});
		}
	},

	removeList: function(db, listName) {
	   db.collection('lists').deleteOne({ 
	   		"list.name": listName 
	  		}, function(err, results) {
	         //console.log(results);
	      }
	   );
	},

	indexLists: function(db, callback) {
	   db.collection('lists').createIndex(
	      { "list.name": 1 },
	      null,
	      function(err, results) {
	         //console.log(results);
	         callback();
	      }
	   );
	},

	createLists: function(lists) {
		for(i = 0; i < lists; i++){
			var list = {"name": "list"+i, "items":[]};
			this.insertList(this.database, list, function(){});
		}
	},

	getNumberOfLists: function(db, callback) {
	    this.findLists(this.database, function(listNames){
			//console.log(listNames.length);
			callback({"lists" : listNames.length});
		});
	}
}