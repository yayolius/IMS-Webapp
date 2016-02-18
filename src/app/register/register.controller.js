(function() {
  'use strict';
  
  angular
    .module('webapp')
    .controller('RegisterController', RegisterController);

  /** @ngInject */
  function RegisterController($scope,AuthenticationService) {
    
    $scope.email = '';
    $scope.password = '';
    $scope.password2 = '';

    $scope.errorMessage = '';
    $scope.showSuccess = false;

    $scope.register = function(ev){

      if($scope.form.$valid){
        $scope.errorMessage = '';
        AuthenticationService.Register($scope.email,$scope.password,function(response){
         
          if( response.hasOwnProperty("success") && response.success === false){
             $scope.errorMessage = response.message;
          }
          else if(response.hasOwnProperty("email") && response.hasOwnProperty("id") ){
            $scope.showSuccess = true;
          }
        });
      }

    }

  }
})();
