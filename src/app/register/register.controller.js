(function() {
  'use strict';
  
  angular
    .module('webapp')
    .controller('RegisterController', RegisterController);

  /** @ngInject */
  function RegisterController($scope,AuthenticationService) {
   
    var vm = this;

    vm.email = '';
    vm.password = '';
    vm.password2 = '';

    vm.errorMessage = '';
    vm.showSuccess = false;

    vm.register = function(){

      if($scope.form.$valid){
        vm.errorMessage = '';
        AuthenticationService.Register(vm.email,vm.password,function(response){
         
          if( response.hasOwnProperty("success") && response.success === false){
             vm.errorMessage = response.message;
          }
          else if(response.hasOwnProperty("email") && response.hasOwnProperty("id") ){
            vm.showSuccess = true;
          }
        });
      }

    }

  }
})();
