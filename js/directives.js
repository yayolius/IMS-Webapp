
var imsDirectives = angular.module('imsDirectives', []);

imsDirectives.directive('sidebar', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/sidebar.html',
        controller: 'SidebarController'
    };
});

