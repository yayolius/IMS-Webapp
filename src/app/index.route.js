(function() {
  'use strict';

  angular
    .module('webapp')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/dashboard',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'app/register/register.html',
        controller: 'RegisterController',
        controllerAs: 'vm'
      }) 
      .state('logout', {
        url: '/logout',
        templateUrl: 'app/logout/logout.html',
        controller: 'LogoutController',
        controllerAs: 'vm'
      })
     
      .state('devices-assign', {
        url: '/devices/assign',
        templateUrl: 'app/assignDevice/assign.device.html',
        controller: 'DeviceAssignController',
        controllerAs: 'vm'
      })
      .state('device', {
        url: '/devices/:deviceId',
        templateUrl: 'app/device/device.html',
        controller: 'DeviceController',
        controllerAs: 'vm'
      })
      ;

    $urlRouterProvider.otherwise('/login');
  }

})();
