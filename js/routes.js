// Configure routes
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })
    .when('/logout', {
      redirectTo: '/login'
    })
    .when('/app', {
      templateUrl: 'templates/dashboard.html',
      controller: 'DashboardController'
    })
    .when('/device/:deviceId', {
      templateUrl: 'templates/device.html',
      controller: 'DeviceController'
    })
    .when('/config', {
      templateUrl: 'templates/config.html',
      controller: 'ConfigController'
    })
    .otherwise({
      redirectTo: '/app'
    });
}]);

