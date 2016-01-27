
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
    if (typeof fakeChart === 'function') {
        fakeChart();
    }
}]);

imsControllers.controller('DeviceController', ['$scope', '$routeParams', function($scope, $routeParams) {
    console.log('DeviceController');
}]);

imsControllers.controller('ConfigController', ['$scope', '$http', function() {
    console.log('ConfigController');
}]);

imsControllers.controller('SidebarController', ['$scope', '$routeParams', '$filter', function($scope, $routeParams, $filter) {
    console.log('SidebarController');

    var searchDevice = function(deviceId, deviceList) {
        for (var i = 0; i < deviceList.length; i++) {
            if (deviceList[i].id == deviceId) {
                return deviceList[i];
            }
        }

        return false;
    }

    // Fake user
    $scope.client = { name: 'Cliente Numero Uno' };

    // Fake device list
    $scope.deviceList = [{
        id: 0,
        pollution: 10,
        name: 'Melee'
    },{
        id: 1,
        pollution: 2.14,
        name: 'Potemkin'
    },{
        id: 9823,
        pollution: 300,
        name: 'Poltergeist'
    }];
    
    if ($routeParams.deviceId) {
        var deviceId = $routeParams.deviceId;
        var currentDevice = searchDevice(deviceId, $scope.deviceList);
        if (currentDevice) {
            $scope.device = currentDevice;
        } else {
            console.log('No device found.');
        }
    } else {
        console.log('no deviceId');
    } 
}]);

