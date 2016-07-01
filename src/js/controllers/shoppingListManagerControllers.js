var shoppingListManagerControllers = angular.module('shoppingListManagerControllers', []);

shoppingListManagerControllers.controller('ViewAllListsCtrl', ['$scope', '$location', 'shoppingListManager', 
	function($scope, $location, shoppingListManager) {
		$scope.lists = [];
		$scope.listSort = false;
		$scope.searchName;
		$scope.listPerPageLimit = 5;
		$scope.page = 1;
		$scope.listPageIndex = 0;
		$scope.pages;

		getLists();

	    function getLists() {
	        shoppingListManager.getLists()
	            .then(function (response) {
	            	console.log("got lists");
	            	console.log(response.data);
	                $scope.lists = response.data;
	                $scope.lists.sort();
	                $scope.getPages();
	            }, function (error) {
	                $scope.status = 'Unable to load customer data: ' + error.message;
	            });
	    }

		$scope.NewList = function() {
			console.log("New list");
			$location.path("/listEdit");
			$location.search('list', null);
		};
		$scope.EditList = function(list) {
			$location.path("/listEdit");
			$location.search('list', list);
		};
		$scope.DeleteList = function(list) {
			shoppingListManager.sendListRemove(list);
			$scope.lists.splice($scope.lists.indexOf(list),1);
			$scope.page = 1;
			$scope.listPageIndex = (($scope.page -1) * $scope.listPerPageLimit);
			$scope.getPages();
		};
		$scope.listNameSearch = function (){
			$scope.page = 1;
			$scope.listPageIndex = (($scope.page -1) * $scope.listPerPageLimit);
		}
		$scope.listNameSort = function() {
			$scope.lists.sort();
			if($scope.listSort == false){
				$scope.listSort = true;
			}else{
				$scope.listSort = false;
			}
			$scope.page = 1;
			$scope.listPageIndex = (($scope.page -1) * $scope.listPerPageLimit);
		};
		$scope.PrevPage = function() {
			if($scope.page > 1){
				$scope.page -= 1;
				$scope.listPageIndex = (($scope.page -1) * $scope.listPerPageLimit);
				$scope.getPages();
			}
		}
		$scope.NextPage = function() {
			if($scope.page < $scope.lists.length/$scope.listPerPageLimit){
				$scope.page += 1;
				$scope.listPageIndex = (($scope.page -1) * $scope.listPerPageLimit);
				$scope.getPages();
			}
		}
		$scope.CanPrev = function() {
			if($scope.page > 1){
				return false;
			}else{
				return true;
			}
		}
		$scope.CanNext = function() {
			if($scope.page < $scope.lists.length/$scope.listPerPageLimit){
				return false;
			}else{
				return true;
			}
		}
		$scope.getPages = function() {
			$scope.pages = [];
			for(i = 0; i < $scope.lists.length/$scope.listPerPageLimit; i++){
				if($scope.page-1 == i){
					$scope.pages.push('radio_button_checked');
				}else{
					$scope.pages.push('radio_button_unchecked');
				}
			}
		}
	}
]);

shoppingListManagerControllers.controller('ListEditCtrl', ['$scope', '$location', 'shoppingListManager',
	function($scope, $location, shoppingListManager) {
		$scope.selectedItem; //item selected by drop down
		$scope.listName; //text input box for list name
		$scope.items;
		$scope.list = {name: "", items: []}; //current list to edit
		$scope.lists = []; //list of lists from server
		$scope.products = []; //array of products
		$scope.uniqueName = false;

		$scope.productsCopy= []; //copy of list of products from server file
		$scope.listCopy = {}; //copy of current list being edited in details page

		getProducts();
		getLists();
		getList();		

		function getProducts() {
	        shoppingListManager.getProducts()
	            .then(function (response) {
	            	console.log("got products");
	            	console.log(response.data);
	                $scope.products = response.data;
	                $scope.productsCopy = JSON.parse(JSON.stringify($scope.products));
	                UpdateProductList();
	            }, function (error) {
	                $scope.status = 'Unable to load customer data: ' + error.message;
	            });
	    }

	    function getList() {
	    	var search = $location.search();
	        shoppingListManager.getList(search.list)
	            .then(function (response) {
	            	console.log("got list");
	            	console.log(response.data);
	                $scope.list = response.data;
	                $scope.listCopy = JSON.parse(JSON.stringify($scope.list));
	                $scope.listName = $scope.list.name;
	               	if($scope.listName != ""){
	               		$('#list_name_label').addClass("active");
	               	}
	                $scope.items = $scope.list.items
	                UpdateProductList();
	            }, function (error) {
	                $scope.status = 'Unable to load customer data: ' + error.message;
	            });
	    }

	    function getLists() {
	        shoppingListManager.getLists()
	            .then(function (response) {
	            	console.log("got lists");
	            	console.log(response.data);
	                $scope.lists = response.data;
	            }, function (error) {
	                $scope.status = 'Unable to load customer data: ' + error.message;
	            });
	    }

	    function UpdateProductList() {
			for(i = 0; i < $scope.products.length; i++){
				if($scope.list.items != undefined){
					for(j = 0; j < $scope.list.items.length; j++){
						if($scope.products[i] == $scope.list.items[j].name){
							$scope.products.splice(i,1);
							i--;
						}
					}
				}
			}
			$scope.items = $scope.list.items
			$("#productSelect option:selected").remove();
		};

		$scope.AddItem = function() {
			if($scope.selectedItem != null){
				var item = {name: $scope.selectedItem, quantity: 1};
				if($scope.list.items === undefined){
					$scope.list.items = [item];
				}else{
					$scope.list.items.push(item);
				}
				UpdateProductList();
			}
		};
		$scope.DeleteItem = function(item) {
			$scope.list.items.splice($scope.list.items.indexOf(item),1);
			$scope.products = JSON.parse(JSON.stringify($scope.productsCopy));
			UpdateProductList();
		};
		$scope.IncreaseQuantity = function(item) {
			item.quantity++;
		};
		$scope.DecreaseQuantity = function(item) {
			if(item.quantity > 1){
				item.quantity--;
			}else{
				$scope.list.items.splice($scope.list.items.indexOf(item),1);
				$scope.products = JSON.parse(JSON.stringify($scope.productsCopy));
				UpdateProductList();
			}
		};
		$scope.UpdateListName = function() {
			$scope.list.name = $scope.listName;
			$scope.uniqueName = false;
			for(i = 0; i < $scope.lists.length; i++){
				if($scope.list.name == $scope.lists[i]){
					$scope.uniqueName = true;
				}
			}
		};
		$scope.SaveList = function() {
			if($scope.list.name === ""){
				alert("List name not set");
			}else{
				if($scope.uniqueName == true){
					alert("List name not unique");
				}else{
					shoppingListManager.sendList($scope.list);
					$scope.lists.push($scope.list.name);
					$scope.listCopy = JSON.parse(JSON.stringify($scope.list));
					alert("Your changes have been saved");
				}
			}
		};
		$scope.ShowSaveListButton = function () {
			var listNew = angular.toJson($scope.list);
			var listOld = angular.toJson($scope.listCopy)
			if(listNew === listOld){
				return true;
			}else{
				if($scope.uniqueName == true) {
					return true;
				}else{
					return false;
				}
			}
		};
		$scope.ShowCancelListButton = function () {
			var listNew = angular.toJson($scope.list);
			var listOld = angular.toJson($scope.listCopy)
			if(listNew === listOld){
				return true;
			}else{
				return false;
			}
		};
		$scope.Cancel = function() {
			confirm("Are you sure you want to revert changes");
			$scope.list = $scope.listCopy;
			$scope.listCopy = JSON.parse(JSON.stringify($scope.list));
			$scope.products = JSON.parse(JSON.stringify($scope.productsCopy));
			UpdateProductList();
			$scope.selectedItem = null;
			$scope.listName = $scope.list.name;
			$scope.uniqueName = false;
		}
		$scope.Home = function() {
			if($scope.ShowSaveListButton() == true){
				$location.path("/");
			}else{
				if(confirm("You have unsaved changes!\nAre you sure you want to leave?") == true){
					$location.path("/");
				}
			}
		}
	}
]);
	