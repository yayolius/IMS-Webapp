(function() {
  'use strict';
  /*global Morris,_ */
  angular
    .module('webapp')
    .controller('DeviceBaselinesController', DeviceBaselinesController);

  /** @ngInject */


  function DeviceBaselinesController($scope,$log,DeviceService,$stateParams,$location,$filter) {
  	var vm = this;
    vm.device = { name: ""};
    vm.availableBaselines = [];


    vm.updateDevice = function(){
        vm.sendingDeviceForm = true;
        DeviceService.UpdateDevice($stateParams.deviceId,vm.device).then(function(response){
          vm.sendingDeviceForm = false;
        });
    }


    DeviceService.GetCurrentUserDevice($stateParams.deviceId).then(function(response){
  		$log.debug(response);
  		if(response.id){
  		  vm.device = response;

        DeviceService.GetDataBaselinesFromDate(vm.device.id,'all').then(function(baselines){
          vm.availableBaselines = baselines;
          setTimeout(function(){drawBaselines();},50);
        });
  		}
    });

    vm.deleteBaseline = function(index){
      var to_remove = vm.availableBaselines[index].allvalues;
      var r = confirm("Esta seguro que desea borrar esta linea base?");
      if(r){
        DeviceService.RemoveBaselines($stateParams.deviceId,to_remove).then(function(response){
          console.log(response);
          vm.availableBaselines.splice(index,1);
        });
      }      
    }

    vm.exportBaseline = function(index){
      var to_export = vm.availableBaselines[index].allvalues;
      DeviceService.ExportBaselines($stateParams.deviceId,to_export).then(function(response){
        download("baseline-"+(new Date()).getTime()+".csv", response);
      });  
    }    

    vm.selectBaseline = function(index){
       var to_select = vm.availableBaselines[index];
       vm.device.baseline_from = to_select.from;
       vm.device.baseline_to = to_select.to;
       vm.device.baseline_value = to_select.baseline;
       vm.updateDevice ();

    }



    function drawBaselines(){


      for(var i = 0; i < vm.availableBaselines.length ; i++){

            var dataBaselines = [];
            vm.availableBaselines[i].allvalues.sort(function(a,b){ return (new Date(a.datetime)).getTime()- (new Date(b.datetime)).getTime() });
            for(var index in vm.availableBaselines[i].allvalues){
              if(vm.availableBaselines[i].allvalues[index].value_baseline)
                dataBaselines.push( [ (new Date(vm.availableBaselines[i].allvalues[index].datetime)).getTime() , vm.availableBaselines[i].allvalues[index].value_baseline]);     
            }



            var options = {
                title: {
                    text: ''
                },
                chart: {
                    zoomType: 'x'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                legend: {
                    enabled: false
                },
                exporting: { enabled: false },
                series: [{
                
                    type: 'line',
                    name: 'Concentración de Polvo (mg/m3)',
                    data: dataBaselines
                }
                ]
            };
            console.log('#basline-graph-'+ i,options)
            $('#basline-graph-'+ i).highcharts(options);
      }
    }

    function download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }

  }
})();