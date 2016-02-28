(function() {
  'use strict';
  angular
    .module('webapp')
    .controller('DeviceAssignController', DeviceAssignController);

  /** @ngInject */
  function DeviceAssignController($log,UserService,DeviceService) {

    
      var vm = this;
      vm.deviceCount = "";
      
      vm.errorMessage = "";
      vm.processingName = false;

      vm.deviceId = "";
      vm.deviceName = "";
      vm.deviceType = "polucion-simple";
      vm.deviceGPS = {lat:"",lng:""};
      vm.deviceMode = "linea-base";
      vm.deviceReadType = "polvo-total";
      vm.deviceLlpDs = "";
      vm.deviceTonelaje = "";
      vm.deviceUmbralAlerta = "";

      vm.sendingDeviceForm = false;


      vm.status = {
                    screen: "name",
                    nameFound: false,
                    nameNotFound:false
                  };
     
      vm.validateAndAssign = function (){
        vm.processingName = true;
        DeviceService.findByName(vm.deviceName).then(function(response){
          

          $log.debug(response);
          
          vm.processingName = false;
          if(response.length == 1){
             vm.deviceId = response[0].id;

              UserService.AllCurrentUserDevices()
              .then(function (res) {
                 var alreadyMine = false;
                 vm.deviceCount = res.length?res.length:0;

                 if(vm.deviceCount > 0){
                    for(var index in res){
                      var rsx = res[index];
                      if(rsx.id == response[0].id){
                        alreadyMine = true;
                      }
                    }
                 }

                

                 if(alreadyMine){
                    vm.status.nameFound = true;
                    vm.status.nameNotFound = false;
                    vm.status.screen = 'already-asigned'; 
                 }else{
                    vm.status.nameFound = true;
                    vm.status.nameNotFound = false;
                    vm.status.screen = 'confirm'; 
                 }
              });

          }else {
            vm.status.nameFound = false;
            vm.status.nameNotFound = true;
             vm.status.screen = 'confirm'; 
           
          }

        });
     }

     vm.backToName = function(){
            vm.status.nameFound = false;
            vm.status.nameNotFound = false;
            vm.status.screen = 'name'; 
     }

     vm.createNewDevice = function(){
        vm.status.screen = 'create'; 
     }

     vm.assignNewDevice = function(){
        DeviceService.AssignCurrentUserToDevice(vm.deviceId).then(function(response){
           vm.status.screen = "success-assign";
           $log.info(response);
        });
     }

     vm.saveNewDevice = function(){
        var newDevice = {
          name : vm.deviceName,
          type : vm.deviceType,
          gps  : vm.deviceGPS,
          mode : vm.deviceMode,
          read_type : vm.deviceReadType,
          llp_ds : vm.deviceLlpDs,
          tonelaje : vm.deviceTonelaje,
          alert_treadshot : vm.deviceUmbralAlerta
        };
        
        if(!newDevice.gps) delete newDevice.gps;
        if(!newDevice.llp_ds) delete newDevice.llp_ds;
        if(!newDevice.tonelaje) delete newDevice.tonelaje;
        if(!newDevice.alert_treadshot) delete newDevice.alert_treadshot;

        DeviceService.CreateCurrentUserDevice(newDevice).then(function(response){  
            $log.debug(response);
            if(response.id){
              vm.status.screen = "success-add";
              vm.deviceId = response.id;
            }
        });
     }

    
  }
})();
