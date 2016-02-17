(function() {
  'use strict';

  angular
    .module('webapp')
    .directive('headerNavbar', headerNavbar);

  /** @ngInject */
  function headerNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbarHeader/navbarHeader.html',
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