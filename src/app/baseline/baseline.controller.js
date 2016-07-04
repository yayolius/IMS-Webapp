(function() {
  'use strict';
  /*global Morris,_ */
  angular
    .module('webapp')
    .controller('BaselineController', BaselineController);

  /** @ngInject */
  function BaselineController($log, $stateParams, UserService, DeviceService) {
      var vm = this;

      DeviceService.GetLastBaseLine($stateParams.deviceId)
        .then(function(result) {
          vm.baselines = result.data.datapoints;
          $log.debug('baseline:', vm.baselines);
        });
  }
})();
