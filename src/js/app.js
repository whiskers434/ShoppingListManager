var shoppingListManagerApp = angular.module('ShoppingListManagerApp', ['ngRoute','shoppingListManagerControllers', 'shoppingListManagerFactory']);
shoppingListManagerApp.config(function($routeProvider){
$routeProvider.
	when('/', {
		templateUrl: '/html/ViewAllLists.html',
		controller: 'ViewAllLists-Ctrl'
	}).
	when('/listEdit', {
		templateUrl: '/html/ListEdit.html',
		controller: 'ListEdit-Ctrl'
	}).
	otherwise({
		redirectTo: '/'
	})
});