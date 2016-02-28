(function() {
  'use strict';
  /*global Morris,_ */
  angular
    .module('webapp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($log,$timeout,UserService,DeviceService) {
      var vm = this;
      vm.deviceCount = 0;
      vm.datapoints = [];
      vm.nodata = false;

      var loadedDevices = 0;

      UserService.AllCurrentUserDevices()
                .then(function (devices) {
                    vm.deviceCount = devices.length;
                   _.forEach(devices,function(device){
                        DeviceService.GetDataPointsFromDate(device.id, 'hour').then(function(datapoints){
                            _.forEach(datapoints,function(point){
                                var npoint = { datetime: point.datetime };
                               
                                npoint[device.id] = point.value;
                                vm.datapoints.push( npoint );
                            });
                            loadedDevices++;
                            if(loadedDevices == vm.deviceCount){
                                initGraph(devices);
                            }
                        });

                   })
                   
                });


    function initGraph(devices){
      
        if(vm.datapoints.length){
            Morris.Area({
                element: 'morris-area-chart',
                data: vm.datapoints,
                xkey: 'datetime',
                ykeys: _.map(devices, 'id'),
                labels: _.map(devices, 'name'),
                pointSize: 0,
                hideHover: true,
                resize: true
            });
        }else{
            vm.nodata = true;
        }
     

    }

    
  }
})();
