var shoppingListManagerApp = angular.module('ShoppingListManagerApp', ['ngRoute','shoppingListManagerControllers', 'shoppingListManagerFactory']);
shoppingListManagerApp.config(function($routeProvider){
$routeProvider.
	when('/', {
		templateUrl: '/views/ViewAllLists.html',
		controller: 'ViewAllListsCtrl'
	}).
	when('/listEdit', {
		templateUrl: '/views/ListEdit.html',
		controller: 'ListEditCtrl'
	}).
	otherwise({
		redirectTo: '/'
	})
});