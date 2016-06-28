var shoppingListManagerControllers = angular.module('shoppingListManagerControllers', []);

shoppingListManagerControllers.controller('ViewAllLists-Ctrl', ['$scope', '$http',  '$location', 'shoppingListManager', 
	function($scope, $http, $location, shoppingListManager) {
		$scope.lists = shoppingListManager.lists;

		$http.get('/getProductList').success(function(productList) {
			shoppingListManager.productsList = productList
			shoppingListManager.products = JSON.parse(JSON.stringify(shoppingListManager.productsList));
			console.log('get products');
			console.log(shoppingListManager.products);
		});

		$http.get('/getLists').success(function(shoppingLists) {
			shoppingListManager.lists = shoppingLists;
			$scope.lists = shoppingLists;
			console.log('get lists');
			console.log(shoppingListManager.lists);
		});

		$scope.NewList = function() {
			console.log("New list");
			$location.path("/listEdit");
			shoppingListManager.list = new shoppingListManager.listObj("", []);
			if(shoppingListManager.lists === undefined){
				shoppingListManager.lists = [shoppingListManager.list];
			}else{
				shoppingListManager.lists.push(shoppingListManager.list);
			}
			shoppingListManager.listCopy = new shoppingListManager.listObj("", []);
			shoppingListManager.products = JSON.parse(JSON.stringify(shoppingListManager.productsList));
			shoppingListManager.UpdateProductList();
		};
		$scope.EditList = function(list) {
			$location.path("/listEdit");
			shoppingListManager.list = list;
			shoppingListManager.listCopy = JSON.parse(JSON.stringify(list));
			shoppingListManager.selectedItem = null;
			shoppingListManager.listName = list.name;
			shoppingListManager.products = JSON.parse(JSON.stringify(shoppingListManager.productsList));
			shoppingListManager.UpdateProductList();
		};
		$scope.DeleteList = function(list) {
			shoppingListManager.lists.splice(shoppingListManager.lists.indexOf(list),1);
			shoppingListManager.sendLists();
		};
	}
]);

shoppingListManagerControllers.controller('ListEdit-Ctrl', ['$scope', '$location', 'shoppingListManager',
	function($scope, $location, shoppingListManager) {
		$scope.selectedItem = null; //item selected by drop down
		$scope.listName = shoppingListManager.list.name; //text input box for list name
		$scope.items = shoppingListManager.list.items; //array of items
		$scope.products = shoppingListManager.products; //array of products

		$scope.AddItem = function() {
			var item = new shoppingListManager.itemObj($scope.selectedItem, 1);
			if(shoppingListManager.list.items === undefined){
				shoppingListManager.list.items = [item];
			}else{
				shoppingListManager.list.items.push(item);
			}
			shoppingListManager.UpdateProductList();
		};
		$scope.DeleteItem = function(item) {
			shoppingListManager.list.items.splice(shoppingListManager.list.items.indexOf(item),1);
			shoppingListManager.products = JSON.parse(JSON.stringify(shoppingListManager.productsList));
			shoppingListManager.UpdateProductList();
			$scope.products = shoppingListManager.products;
		};
		$scope.IncreaseQuantity = function(item) {
			item.quantity++;
		};
		$scope.DecreaseQuantity = function(item) {
			if(item.quantity > 1){
				item.quantity--;
			}else{
				shoppingListManager.list.items.splice(shoppingListManager.list.items.indexOf(item),1);
				shoppingListManager.products = JSON.parse(JSON.stringify(shoppingListManager.productsList));
				shoppingListManager.UpdateProductList();
				$scope.products = shoppingListManager.products;
			}
		};
		$scope.UpdateListName = function() {
			shoppingListManager.list.name = $scope.listName;
		};
		$scope.SaveList = function() {
			shoppingListManager.list.name = $scope.listName;
			if(shoppingListManager.list.name === "")
			{
				shoppingListManager.list.name = "list";
			}
			$location.path("/");
			shoppingListManager.sendLists();
		};
		$scope.ShowSaveListButton = function () {
			var listNew = angular.toJson(shoppingListManager.list);
			var listOld = angular.toJson(shoppingListManager.listCopy)
			if(listNew === listOld){
				return true;
			}else{
				return false;
			}
		};
		$scope.Cancel = function() {
			$location.path("/");
			shoppingListManager.list = shoppingListManager.listCopy;
			if(angular.toJson(shoppingListManager.list) === angular.toJson(new shoppingListManager.listObj("", [])))
			{
				shoppingListManager.lists.splice(shoppingListManager.lists.indexOf(shoppingListManager.list),1);
			}
		}
	}
]);
	