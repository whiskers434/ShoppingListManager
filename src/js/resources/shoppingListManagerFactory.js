angular.module('shoppingListManagerFactory', [])
.factory('shoppingListManager', ['$http',
	function ($http) {
		var shoppingListManager = {};

		shoppingListManager.productsList = []; //copy of list of products from server file

		shoppingListManager.lists = []; //array of lists
		shoppingListManager.products = []; //array of products

		shoppingListManager.list = {}; //current list being edited in details page
		shoppingListManager.listCopy = {}; //copy of current list being edited in details page

		//list object
		shoppingListManager.listObj = function(name, items){
			this.name = name;
			this.items = items;
		}

		//item object
		shoppingListManager.itemObj = function(name, quantity){
			this.name = name;
			this.quantity = quantity;
		}

		shoppingListManager.sendLists = function() {
			console.log('send lists');
			console.log(shoppingListManager.lists);
			//$http.get('/sendLists', lists);
			$http.post('/sendLists', shoppingListManager.lists).
	        success(function(data) {
	            console.log("posted successfully");
	        }).error(function(data) {
	            console.error("error in posting");
	        });
		};

		shoppingListManager.UpdateProductList = function() {
			for(i = 0; i < shoppingListManager.products.length; i++){
				for(j = 0; j < shoppingListManager.list.items.length; j++){
					if(shoppingListManager.products[i] == shoppingListManager.list.items[j].name){
						shoppingListManager.products.splice(i,1);
						i--;
					}
				}
			}
			$('select').material_select();
		};
		return shoppingListManager;
	}
]);