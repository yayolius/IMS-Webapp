(function() {
  'use strict';
  angular
    .module('webapp')
    .controller('DeviceController', DeviceController);

  /** @ngInject */
  function DeviceController($scope,$log,DeviceService,$stateParams) {
      var vm = this;
      vm.device = { name: ""};
      vm.deviceGraph = null;
      vm.markers = [];


      vm.map = { center: { latitude: 0, longitude:0 }, zoom: 13, bounds: {  } , options:{ scrollwheel: false } };


      vm.slider = {
        value: 0,
        options: {
          stepsArray:["Baja","Media","Alta"]
        }
      };


       $scope.$watch(function() {
            return vm.map.bounds;
        }, function(ovm, nvm) {
            $log.info( ovm );
            $log.info( nvm );
        });



      DeviceService.GetCurrentUserDevice($stateParams.deviceId).then(function(response){
          $log.debug(response);
          if(response.id){
            vm.device = response;

            vm.drawGraphFromTime();
            
          }
      });

      vm.drawGraphFromTime = function drawGraphFromTime(){
      
        console.log('drawGraphFromTime');
        DeviceService.GetDataPointsFromDate(vm.device.id, 'day').then(function(response){

          var points = [];
          _.forEach(response,function(res,index){
            if(res.gps){
              var found = false;
              _.forEach(points,function(point){
                  if( point.latitude == res.gps.lat && point.longitude == res.gps.lng ){
                    found = true;
                  }
              });
              if(!found){
                points.push({  latitude: res.gps.lat, longitude: res.gps.lng,id:index })
              }
            }
          });

          vm.markers = points;
          if(points.length > 0){
            vm.map.center = _.cloneDeep(points[0]);
            delete vm.map.center.index;
          }

          var goals = [];
          
          if(vm.device.alert_treadshot) goals.push(vm.device.alert_treadshot);

          if(!vm.deviceGraph && response.length > 0){
            $("#last-time-chart").text("");
            vm.deviceGraph =  Morris.Line({
                element: 'last-time-chart',
                data: response,
                xkey: 'datetime',
                ykeys: ['value'],
                labels: ['Value'],
                goals: goals,
                goalLineColors: ['#ff0000'],
                pointSize: 0,
                hideHover: 'auto',
                parseTime:true,
                resize: true,
                smooth: false,
                lineWidth:2,
                goalStrokeWidth:2,
                ymax:120,
                xLabels:['minute']
            });
          }
          else if(vm.deviceGraph && response.length > 0){
            vm.deviceGraph.setData(response);
          }else if(response.length === 0){
            $("#last-time-chart").text("No existen datos para graficar");
          }
         
        });
        
      }
  }
})();
