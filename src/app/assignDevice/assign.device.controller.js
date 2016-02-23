(function() {
  'use strict';
  /*global Morris */
  angular
    .module('webapp')
    .controller('DeviceAssignController', DeviceAssignController);

  /** @ngInject */
  function DeviceAssignController($log,UserService) {
      var vm = this;
      vm.deviceCount = "";
      vm.errorMessage = "";
     



    
  }
})();
