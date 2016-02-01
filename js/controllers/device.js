imsControllers.controller('DeviceController', ['$scope', '$routeParams', function($scope, $routeParams) {
    console.log('DeviceController');

    if (typeof fakeDeviceChart === 'function') {
        fakeDeviceChart();
    } else {
        console.log('No device chart.');
    }
}]);

