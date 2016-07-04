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
      .state('device-settings', {
        url: '/devices/:deviceId/settings',
        templateUrl: 'app/device-settings/device-settings.html',
        controller: 'DeviceSettingsController',
        controllerAs: 'vm'
      })
      .state('device-baselines', {
        url: '/devices/:deviceId/baselines',
        templateUrl: 'app/device-baselines/device-baselines.html',
        controller: 'DeviceBaselinesController',
        controllerAs: 'vm'
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminController',
        controllerAs: 'vm'
      })
      ;

    $urlRouterProvider.otherwise('/login');
  }

})();
