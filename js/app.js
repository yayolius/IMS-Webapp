/* Routes */
angular.module('ims', ['ngRoute']).config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/app/:path**', {
        templateUrl: '',
        controller: ''
    }).otherwise({
        templateUrl: '',
        controller: ''
    });
}]);

/* Controllers */
angular.module('ims')
.controller('LoginController', ['$scope', '$routeParams', function($scope, $routeParams) {
    console.log('$routeParams: ', $routeParams);
}]);

