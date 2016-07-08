angular.module('shoppingListManagerFactory', [])
.factory('shoppingListManager', ['$http', 
	function ($http) {
		var shoppingListManager = {};

		shoppingListManager.getProducts = function(){ 
			//console.log('get products');
			return $http.get('/getProductList');
		};

		shoppingListManager.getLists = function(page){ 
			//console.log('get lists ' + page);
			return $http.get('/getLists/' + page);
		};

		shoppingListManager.getNumOfLists = function(){ 
			//console.log('get lists');
			return $http.get('/getNumOfLists');
		};

		shoppingListManager.getList = function(list){
			//console.log('get list ' + list);
			return $http.get('/getList/' + list);
		};

		shoppingListManager.writeList = function(list) {
			//console.log('send list');
			//console.log(list);
			$http.post('/writeList', list).
		        success(function(data) {
		            console.log("posted successfully");
		        }).error(function(data) {
		            console.error("error in posting");
	        });
		};

		shoppingListManager.deleteList = function(list) {
			//console.log('send list remove');
			//console.log(list);
			$http.post('/deleteList', {list}).
		        success(function(data) {
		            console.log("posted successfully");
		        }).error(function(data) {
		            console.error("error in posting");
	        });
		};

		return shoppingListManager;
	}
]);