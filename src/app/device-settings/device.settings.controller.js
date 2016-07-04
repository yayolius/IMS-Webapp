(function() {
  'use strict';
  /*global Morris,_ */
  angular
    .module('webapp')
    .controller('DeviceSettingsController', DeviceSettingsController);

  /** @ngInject */
  function DeviceSettingsController($scope,$rootScope,$log,DeviceService,UserService,$stateParams,$location,$filter) {
  	var vm = this;
    vm.device = { name: ""};
    vm.deviceUsers = [];

    vm.currentUserId = $rootScope.globals.currentUser.userId;

    DeviceService.GetCurrentUserDevice($stateParams.deviceId).then(function(response){
  		$log.debug(response);
  		if(response.id){
  		  vm.device = response;


        DeviceService.GetUserlist($stateParams.deviceId).then(function(response){
          vm.deviceUsers = response;

          _.forEach(vm.deviceUsers,function(user){
            (function(u){
              UserService.isDeviceAdmin(u.id,vm.device.id)
                .then(function (res) {
                  console.log(u,res);
                  if(res){
                    u.isDeviceAdmin = res.is;
                  }
                });
               })(user);
          });
        });
        
  		}
    });

    


     vm.undoDeviceAdmin = function(index){
      UserService.RemoveDeviceAdminPrivileges( vm.deviceUsers[index].id,vm.device.id)
          .then(function (res) {
              UserService.isDeviceAdmin( vm.deviceUsers[index].id,vm.device.id)
              .then(function (res) {
                console.log( vm.deviceUsers[index],res);
                if(res){
                   vm.deviceUsers[index].isDeviceAdmin = res.is;
                }
              });
          });
    }


    vm.doDeviceAdmin = function(index){
      UserService.AddDeviceAdminPrivileges(vm.deviceUsers[index].id,vm.device.id)
          .then(function (res) {
              UserService.isDeviceAdmin( vm.deviceUsers[index].id,vm.device.id)
              .then(function (res) {
                console.log( vm.deviceUsers[index],res);
                if(res && res.is){
                   vm.deviceUsers[index].isDeviceAdmin = true;
                }else{
                   vm.deviceUsers[index].isDeviceAdmin = false;
                }
              });
          });
    }

    vm.updateDevice = function(){
        vm.sendingDeviceForm = true;
        DeviceService.UpdateDevice($stateParams.deviceId,vm.device).then(function(response){
          vm.sendingDeviceForm = false;
        });
    }

  }


})();