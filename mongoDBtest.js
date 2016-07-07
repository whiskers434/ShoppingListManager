var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/shoppingListManager';


MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  module.exports.findProducts(db, function() {
      //console.log(products);
  });
  module.exports.findLists(db, function() {
      //console.log(lists);
  });
  module.exports.database = db;
});

module.exports = {
	products: [null],
	listNames: [null],
	lists: [null],
	database: null,

	findProducts: function(db, callback) {
	   var cursor =db.collection('productList').find();
	   cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	         //console.dir(doc);
	         //console.dir(doc.product);
	         if(this.products === undefined){
	         	this.products = [doc.product];
	         }else{
	         	this.products.push(doc.product);
	         }
	      } else {
	         callback();
	      }
	   });
	},

	getProducts: function () {
		return products;
	},

	findLists: function(db, callback) {
	   var cursor =db.collection('lists').find();
	   cursor.each(function(err, doc) {
	      assert.equal(err, null);
	      if (doc != null) {
	         console.dir(doc);
	         //console.dir(doc.list.name);
	         if(this.lists === undefined){
	         	this.lists = [doc.list];
	         }else{
	         	this.lists.push(doc.list);
	         }
	         if(this.listNames === undefined){
	         	this.listNames = [doc.list.name];
	         }else{
	         	this.listNames.push(doc.list.name);
	         }
	      } else {
	         callback();
	      }
	   });
	},

	getLists: function () {
	    return listNames;
	},

	getList: function(listName){
		var list = lists[listNames.indexOf(listName)];
		return list;
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

	updateList: function(db, list, callback) {
	   db.collection('lists').updateOne({ "list.name": list.name},
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
		var i = listNames.indexOf(newList.name);
		if(i == -1){
			this.insertList(this.database, newList, function() {});
			listNames.push(newList.name);
			lists.push(newList);
			if(oldListName != ""){
				this.deleteList(oldListName);
			}
		}else{
			this.updateList(this.database, newList, function() {});
			lists[i] = newList;
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
		lists.splice(listNames.indexOf(listName),1);
		listNames.splice(listNames.indexOf(listName),1);
	},
}