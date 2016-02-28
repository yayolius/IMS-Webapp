(function() {
  'use strict';
 /*globals $ */
  angular
    .module('webapp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log,$rootScope, $location, $cookies, $http,AuthenticationService) {

  AuthenticationService.ReloadSavedCredentials();

      var call = $rootScope.$on('$locationChangeStart', function (/*event, next, current*/ ) {
      
      $rootScope.$on( '$destroy', call );
      // redirect to login page if not logged in and trying to access a restricted page
      var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
      var loggedIn = false;
      
      if ( $rootScope.globals && $rootScope.globals.currentUser) {
        loggedIn = $rootScope.globals.currentUser;
      }
      if (restrictedPage && !loggedIn) {
        $location.path('/login');
      }


    });

    $log.debug('runBlock end');
  }

})();
