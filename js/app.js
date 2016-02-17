// Global app var
var app = angular.module('ims', ['ngRoute', 'ngCookies', 'imsFactories', 'imsControllers', 'imsDirectives']);
var imsFactories = angular.module('imsFactories', []);
var imsDirectives = angular.module('imsDirectives', []);
var imsControllers = angular.module('imsControllers', []);

// Default app parameters
app.params = {
  api: {
    //path: 'http://159.203.114.208:3000/api'
    path: 'http://127.0.0.1:3000/api'
  }
}

// Detect if auth

app.run(function($rootScope, $location, $cookies) {
  var authlessPath = '/login';
  var user = $cookies.get('ims');

  if (typeof user === 'undefined' && !user && $location.$$path !== authlessPath) {
    $location.path('/login');
  }
});

