angular.module('shoppingListManagerFactory', [])
.factory('shoppingListManager', ['$http', 
	function ($http) {
		var shoppingListManager = {};

		shoppingListManager.getProducts = function(){ 
			console.log('get products');
			return $http.get('/getProductList');
		};

		shoppingListManager.getLists = function(){ 
			console.log('get lists');
			return $http.get('/getLists');
		};

		shoppingListManager.getList = function(list){
			console.log('get list ' + list);
			return $http.get('/getList',{params: {list: list}});
		};

		shoppingListManager.sendList = function(list) {
			console.log('send list');
			console.log(list);
			$http.post('/writeList', list).
		        success(function(data) {
		            console.log("posted successfully");
		        }).error(function(data) {
		            console.error("error in posting");
	        });
		};

		shoppingListManager.sendListRemove = function(list) {
			console.log('send list remove');
			console.log(list);
			$http.post('/deleteRemove', {list}).
		        success(function(data) {
		            console.log("posted successfully");
		        }).error(function(data) {
		            console.error("error in posting");
	        });
		};

		return shoppingListManager;
	}
]);