
var imsControllers = angular.module('imsControllers', []);

imsControllers.controller('LoginController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    console.log('LoginController');
    $scope.login = function() {
        console.log('login, move to app');
        window.location.href = '#/app';
    }
}]);

imsControllers.controller('DashboardController', ['$scope', '$http', function($scope) {
    console.log('DashboardController');    
}]);

imsControllers.controller('DeviceController', ['$scope', '$routeParams', function($scope, $routeParams) {
    console.log('DeviceController');
}]);

imsControllers.controller('ConfigController', ['$scope', '$http', function() {
    console.log('ConfigController');
}]);

imsControllers.controller('SidebarController', ['$scope', '$routeParams', '$filter', function($scope, $routeParams, $filter) {
    console.log('$routeParams: ', $routeParams);
    console.log('SidebarController');

    // Fake user
    $scope.client = { name: 'Cliente Numero Uno' };

    // Fake device list
    $scope.deviceList = [{
        id: 0,
        name: 'Melee'
    },{
        id: 1,
        name: 'Potemkin'
    },{
        id: 9823,
        name: 'Poltergeist'
    }];
    
    if ($routeParams.deviceId) {
        var searchDevice = $filter('filter')($scope.deviceList, $routeParams.deviceId);
        if (searchDevice.length > 0) {
            $scope.device = searchDevice[0];
        }
    } else {
        console.log('no deviceId');
    } 
}]);

