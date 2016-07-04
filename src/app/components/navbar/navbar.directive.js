(function() {
  'use strict';

  angular
    .module('webapp')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController(moment, UserService) {
      var vm = this;
      vm.deviceCount = 0;
      vm.devices = [];
      vm.isAdmin = false;

      UserService.AllCurrentUserDevices()
              .then(function (res) {
                 vm.deviceCount = res.length?res.length:0;
                 if(vm.deviceCount > 0){
                    vm.devices = res;
                 }
              });

      UserService.isAdmin()
              .then(function (res) {
                if(res && res.is){
                  vm.isAdmin = true;
                }
              });


      // "vm.creation" is avaible by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();
    }
  }

})();
