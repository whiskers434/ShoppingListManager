var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/shoppingListManager';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  module.exports.findProducts(db, function() {});
  module.exports.findLists(db, function() {});
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
	         //console.dir(doc.product);
	         if(products === undefined){
	         	products = [doc.product];
	         }else{
	         	products.push(doc.product);
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
	    console.log("Inserted a list into the lists collection.");
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
	      	console.log("Update a list into the lists collection.");
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

	removeList: function(db, listName, callback) {
	   db.collection('lists').deleteOne({ 
	   		"list.name": listName 
	  		}, function(err, results) {
	         //console.log(results);
	         callback();
	      }
	   );
	},

	deleteList: function(listName){
		this.removeList(this.database, listName, function() {});
	},
}