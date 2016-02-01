imsControllers.controller('SidebarController', ['$scope', '$routeParams', '$filter', '$location', '$cookies', 'UserFactory', function($scope, $routeParams, $filter, $location, $cookies, UserFactory) {

  var user = $cookies.getObject('ims');

  if (!user && typeof user === 'undefined' && $location.$$path !== '/login') {
    $location.path('/login');
  } else {
    app.user = user;
  }

  var searchDevice = function(deviceId, deviceList) {
    for (var i = 0; i < deviceList.length; i++) {
      if (deviceList[i].id == deviceId) {
        return deviceList[i];
      }
    }

    return false;
  }

  // Fake user
  $scope.client = { name: app.user.email};

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

  $scope.logout = function() {
    UserFactory.logout(app.user.id).then(function() {
      $cookies.remove('ims');
      $location.path('/logout');
    });
  }
}]);

