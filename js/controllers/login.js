imsControllers.controller('LoginController', ['$scope', '$http', '$routeParams', '$location', '$cookies', 'UserFactory', function($scope, $http, $routeParams, $location, $cookies, UserFactory) {

  // Do not allow logged in user on /login
  var user = $cookies.getObject('ims');

  if (user && typeof user !== 'undefined' && $location.$$path === '/login') {
    $location.path('/app');
  }

  $scope.login = function() {
    UserFactory.login($scope.email, $scope.password).then(function(result) {
      if (result.status === 200) {
        app.user = result.data;
        $cookies.putObject('ims', app.user);
        $location.path('/app');
      } else {
        $scope.error = 'Error al ingresar. Intente denuevo mas tarde.';
      }

      // Catch errors
    }).catch(function(error) {
      $scope.error = 'Correo o contraseña incorrectos.';
    });
  }
}]);

