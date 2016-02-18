(function() {
  'use strict';
  
  angular
    .module('webapp')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($scope,AuthenticationService,$location) {
    
    $scope.email = '';
    $scope.password = '';
    $scope.rememberme = false;

    $scope.errorMessage = '';

    $scope.login = function (){
    	if($scope.form.$valid){
        $scope.errorMessage = '';
        AuthenticationService.Login($scope.email,$scope.password,function(response){
          console.log(response);
          if( response.hasOwnProperty("success") && response.success === false){
             $scope.errorMessage = response.message;
          }
          else if(response.hasOwnProperty("id") && response.hasOwnProperty("userId") ){
            //$scope.showSuccess = true;
            $location.path('/');
          }
        });
      }
    }
  }
})();
