var shoppingListManagerControllers = angular.module('shoppingListManagerControllers', []);

shoppingListManagerControllers.controller('ViewAllListsCtrl', ['$scope', '$location', 'shoppingListManager', 
	function($scope, $location, shoppingListManager) {
		$scope.lists = []; //array of list names
		$scope.listSort = false; //when false lists are sorted ASC, when true lists are sorted DSC
		$scope.searchName; //search input field value
		$scope.listPerPageLimit = 5; //number of lists to display on pager
		$scope.page = 1; //page number of pager
		$scope.listPageIndex = 0; //first index of list array for first list on current page of pager
		$scope.pages; //total pages of pager

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
			//change to the edit page for a new list
			$location.path("/listEdit/");
			$location.search('list', null);
		};
		$scope.EditList = function(list) {
			//change to the edit page for list
			$location.path("/listEdit");
			$location.search('list', list);
		};
		$scope.DeleteList = function(list) {
			//delete list
			shoppingListManager.sendListRemove(list);
			$scope.lists.splice($scope.lists.indexOf(list),1);
			//reset pager with new amount of lists
			$scope.page = 1;
			$scope.listPageIndex = (($scope.page -1) * $scope.listPerPageLimit);
			$scope.getPages();
		};
		$scope.listNameSearch = function (){
			//reset pager with search input
			$scope.page = 1;
			$scope.listPageIndex = (($scope.page -1) * $scope.listPerPageLimit);
			$scope.getPages();
		}
		$scope.listNameSort = function() {
			//sort list toggle ASC or DSC
			$scope.lists.sort();
			if($scope.listSort == false){
				$scope.listSort = true;
			}else{
				$scope.listSort = false;
			}
			//reset pager with sort
			$scope.page = 1;
			$scope.listPageIndex = (($scope.page -1) * $scope.listPerPageLimit);
			$scope.getPages();
		};
		$scope.PrevPage = function() {
			//if current page is not the first page
			if($scope.page > 1){
				//go back one page
				$scope.page -= 1;
				//update pager with new page
				$scope.listPageIndex = (($scope.page -1) * $scope.listPerPageLimit);
				$scope.getPages();
			}
		}
		$scope.NextPage = function() {
			//if current page is not last page
			if($scope.page < $scope.lists.length/$scope.listPerPageLimit){
				//go forward one page
				$scope.page += 1;
				//update pager with new page
				$scope.listPageIndex = (($scope.page -1) * $scope.listPerPageLimit);
				$scope.getPages();
			}
		}
		$scope.goToPage = function (id){
			//go to page of id
			$scope.page = id;
			//update pager with new page
			$scope.listPageIndex = (($scope.page -1) * $scope.listPerPageLimit);
			$scope.getPages();
		}
		$scope.CanPrev = function() { //enable or disable prev button of pager
			//if current page is not the first page
			if($scope.page > 1){
				return false;
			}else{
				return true;
			}
		}
		$scope.CanNext = function() { //enable or disable next button of pager
			//if current page is not last page
			if($scope.page < $scope.lists.length/$scope.listPerPageLimit){
				return false;
			}else{
				return true;
			}
		}
		$scope.getPages = function() { //draw page numbers of pager
			$scope.pages = [];
			for(i = 0; i < $scope.lists.length/$scope.listPerPageLimit; i++){
				if($scope.page-1 == i){ 
					$scope.pages.push({id: i +1, color: '#0277bd'});
				}else{
					$scope.pages.push({id: i +1, color: '#000000'});
				}
			}
		}

	}
]);

shoppingListManagerControllers.controller('ListEditCtrl', ['$scope', '$location', 'shoppingListManager',
	function($scope, $location, shoppingListManager) {
		$scope.selectedItem = null; //item value selected of product by drop down list
		$scope.listName = ""; //text input value for list name
		$scope.items = []; //array of items in the current list
		$scope.list = {name: "", items: []}; //current list to edit
		$scope.lists = []; //array of lists names
		$scope.products = []; //array of item product names
		$scope.uniqueName = false; //false if list name is unique, true if list name is not unique
		$scope.saved = false; //true if the list is saved
		$scope.name = ""; //name of list being edited incase of rename

		$scope.productsCopy= []; //copy of products names
		$scope.listCopy = {}; //copy of current list being edited

		getProducts();
		getLists();
		getList();		

		function getProducts() {
	        shoppingListManager.getProducts()
	            .then(function (response) {
	            	console.log("got products");
	            	console.log(response.data);
	                $scope.products = response.data;
	                $scope.products.sort();
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
	                $scope.name = JSON.parse(JSON.stringify($scope.list.name));
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
					shoppingListManager.sendList({list: $scope.list, oldName: $scope.name});
					$scope.listCopy = JSON.parse(JSON.stringify($scope.list));
					$scope.saved = true;
					setTimeout(function(){ $scope.saved = false; }, 1000);
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
	