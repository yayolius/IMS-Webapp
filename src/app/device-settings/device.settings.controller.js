(function() {
  'use strict';
  /*global Morris,_ */
  angular
    .module('webapp')
    .controller('DeviceSettingsController', DeviceSettingsController);

  /** @ngInject */
  function DeviceSettingsController($scope,$log,DeviceService,$stateParams,$location,$filter) {
  	var vm = this;
    vm.device = { name: ""};

    DeviceService.GetCurrentUserDevice($stateParams.deviceId).then(function(response){
		$log.debug(response);
		if(response.id){
		vm.device = response;
		}
    });

    vm.updateDevice = function(){
        vm.sendingDeviceForm = true;
        DeviceService.UpdateDevice($stateParams.deviceId,vm.device).then(function(response){
          $log.info(response);
          vm.sendingDeviceForm = false;
        });
    }

  }


})();