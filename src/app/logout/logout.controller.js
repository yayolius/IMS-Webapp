(function() {
  'use strict';
  
  angular
    .module('webapp')
    .controller('LogoutController', LogoutController);

  /** @ngInject */
  function LogoutController($scope,AuthenticationService,$location) {
    
    AuthenticationService.Logout(function(){
      $location.path('/login')
    });
    
  }
})();
