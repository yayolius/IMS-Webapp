(function() {
  'use strict';
  
  angular
    .module('webapp')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($scope,AuthenticationService,$location,$log) {
    var vm = this;
    vm.email = '';
    vm.password = '';
    vm.rememberme = false;
    vm.showSuccess = false;

    vm.errorMessage = '';

    vm.login = function (){
      if($scope.form.$valid){
        vm.errorMessage = '';
        AuthenticationService.Login(vm.email,vm.password,function(response){
          $log.debug(response);
          if( response.hasOwnProperty("success") && response.success === false){
             vm.errorMessage = response.message;
          }
          else if(response.hasOwnProperty("id") && response.hasOwnProperty("userId") ){
            vm.showSuccess = true;
            $location.path('/dashboard');
          }
        });
      }
    }
  }
})();
