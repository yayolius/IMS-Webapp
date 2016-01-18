
var imsControllers = angular.module('imsControllers', []);

imsControllers.controller('LoginController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    console.log('LoginController');
    $scope.login = function() {
        console.log('login, move to app');
        window.location.href = '#/app';
    }
}]);

imsControllers.controller('DashboardController', ['$scope', '$http', function($scope, $http) {
    console.log('DashboardController');
}]);

imsControllers.controller('DeviceController', ['$scope', '$http', function() {
    console.log('DeviceController');
}]);

imsControllers.controller('ConfigController', ['$scope', '$http', function() {
    console.log('ConfigController');
}]);

imsControllers.controller('SidebarController', ['$scope', function() {
    console.log('SidebarController');
}]);

