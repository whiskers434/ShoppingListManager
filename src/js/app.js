var shoppingListManagerApp = angular.module('ShoppingListManagerApp', ['ngRoute','shoppingListManagerControllers', 'shoppingListManagerFactory']);
shoppingListManagerApp.config(function($routeProvider){
$routeProvider.
	when('/', {
		templateUrl: '/html/ViewAllLists.html',
		controller: 'ViewAllListsCtrl'
	}).
	when('/listEdit', {
		templateUrl: '/html/ListEdit.html',
		controller: 'ListEditCtrl'
	}).
	otherwise({
		redirectTo: '/'
	})
});