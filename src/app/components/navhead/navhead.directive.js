(function() {
  'use strict';

  angular
    .module('webapp')
    .directive('headerNavbar', headerNavbar);

  /** @ngInject */
  function headerNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navhead/navhead.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarHeaderController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarHeaderController() {
      

    }
  }

})();