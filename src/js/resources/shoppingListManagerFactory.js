angular.module('shoppingListManagerFactory', [])
.factory('shoppingListManager', ['$http', 
	function ($http) {
		var shoppingListManager = {};
		var webServicePort = 'http://localhost:3001';

		shoppingListManager.getProducts = function(){ 
			console.log('get products');
			return $http.get(webServicePort + '/getProductList');
		};

		shoppingListManager.getLists = function(){ 
			console.log('get lists');
			return $http.get(webServicePort + '/getLists');
		};

		shoppingListManager.getList = function(list){
			console.log('get list ' + list);
			return $http.post(webServicePort + '/getList', {list});
		};

		shoppingListManager.sendList = function(list) {
			console.log('send list');
			console.log(list);
			$http.post(webServicePort + '/sendList', list).
		        success(function(data) {
		            console.log("posted successfully");
		        }).error(function(data) {
		            console.error("error in posting");
	        });
		};

		shoppingListManager.sendListRemove = function(list) {
			console.log('send list remove');
			console.log(list);
			$http.post(webServicePort + '/sendListRemove', {list}).
		        success(function(data) {
		            console.log("posted successfully");
		        }).error(function(data) {
		            console.error("error in posting");
	        });
		};

		return shoppingListManager;
	}
]);