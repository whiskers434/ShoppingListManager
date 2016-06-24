var socket = io();

socket.emit("getProductList");
socket.emit("getLists");


var app = angular.module('ShoppingListManager', []);
app.controller('ShoppingListsController', function($scope) {
	this.productsList = []; //copy of list of products from server file

	this.lists = []; //array of lists
	this.products = []; //array of products

	this.list = {}; //current list being edited in details page
	this.listCopy = {}; //copy of current list being edited in details page

	this.selectedItem = null; //item selected by drop down
	this.listName = ""; //text input box for list name

	this.detailsPage = false; //bool for whether to show details page or not

	//list object
	function listObj(name, items){
		this.name = name;
		this.items = items;
	}

	//item object
	function itemObj(name, quantity){
		this.name = name;
		this.quantity = quantity;
	}

	this.NewList = function() {
		$scope.detailsPage = true;
		$scope.list = new listObj("", []);
		if($scope.lists === null){
			$scope.lists = [$scope.list];
		}else{
			$scope.lists.push($scope.list);
		}
		$scope.listCopy = new listObj("", []);
		$scope.selectedItem = null;
		$scope.listName = "";
		$scope.products = JSON.parse(JSON.stringify($scope.productsList));
		UpdateProductList();
	};
	this.EditList = function(list) {
		$scope.detailsPage = true;
		$scope.list = list;
		$scope.listCopy = JSON.parse(JSON.stringify(list));
		$scope.selectedItem = null;
		$scope.listName = list.name;
		$scope.products = JSON.parse(JSON.stringify($scope.productsList));
		UpdateProductList();
	};
	this.DeleteList = function(list) {
		$scope.lists.splice($scope.lists.indexOf(list),1);
		socket.emit("ReceiveLists", $scope.lists);
	};
	this.AddItem = function() {
		var item = new itemObj($scope.selectedItem, 1);
		if($scope.list.items === undefined){
			$scope.list.items = [item];
		}else{
			$scope.list.items.push(item);
		}
		UpdateProductList();
	};
	this.DeleteItem = function(item) {
		$scope.list.items.splice($scope.list.items.indexOf(item),1);
		$scope.products = JSON.parse(JSON.stringify($scope.productsList));
		UpdateProductList();
	};
	this.IncreaseQuantity = function(item) {
		item.quantity++;
	};
	this.DecreaseQuantity = function(item) {
		if(item.quantity > 1){
			item.quantity--;
		}else{
			$scope.list.items.splice($scope.list.items.indexOf(item),1);
			$scope.products = JSON.parse(JSON.stringify($scope.productsList));
			UpdateProductList();
		}
	};
	this.UpdateListName = function() {
		$scope.list.name = $scope.listName;
	};
	this.SaveList = function() {
		$scope.list.name = $scope.listName;
		if($scope.list.name === "")
		{
			$scope.list.name = "list";
		}
		$scope.detailsPage = false;
		socket.emit("ReceiveLists", $scope.lists);
	};
	this.ShowSaveListButton = function () {
		var listNew = angular.toJson($scope.list);
		var listOld = angular.toJson($scope.listCopy)
		if(listNew === listOld){
			return false;
		}else{
			return true;
		}
	};
	this.Cancel = function() {
		$scope.detailsPage = false;
		$scope.list = $scope.listCopy;
		if(angular.toJson($scope.list) === angular.toJson(new listObj("", [])))
		{
			$scope.lists.splice($scope.lists.indexOf($scope.list),1);
		}
	}
	UpdateProductList = function() {
		for(i = 0; i < $scope.products.length; i++){
			for(j = 0; j < $scope.list.items.length; j++){
				if($scope.products[i] == $scope.list.items[j].name){
					$scope.products.splice(i,1);
					i--;
				}
			}
		}
		$('select').material_select();
		$('select').val('');
	};

	socket.on("ReceiveProductList", function(productList){
		$scope.productsList = productList
		$scope.products = JSON.parse(JSON.stringify($scope.productsList));
		//console.log($scope.products);
		$scope.$apply()
	});

	socket.on("ReceiveList", function(shoppingLists){
		$scope.lists = shoppingLists;
		//console.log($scope.lists);
		$scope.$apply()
	});

});