imsFactories.factory('UserFactory', ['$http', function($http) {
  return {
    // Try login a user with email and password
    login: function(email, password) {
      return $http({
        method: 'POST',
        url: app.params.api.path + '/Users/login',
        data: {
          email: email,
          password: password
        }
      }).then(function(result) {
        return result;
      });
    },

    // Logout a logged in user
    logout: function(accessToken) {
      return $http({
        method: 'POST',
        url: app.params.api.path + '/Users/logout?access_token=' + accessToken
      }).then(function(result) {
        return result;
      });
    }
  }
}]);

