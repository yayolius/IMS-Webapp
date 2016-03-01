(function() {
  'use strict';
  /*global Morris,_ */
  angular
    .module('webapp')
    .controller('DeviceController', DeviceController);

  /** @ngInject */
  function DeviceController($scope,$log,DeviceService,$stateParams,$location) {
      var vm = this;
      vm.device = { name: ""};
      vm.deviceGraph = null;
      vm.markers = [];
      vm.hasEmptyDatapoints = false;


      vm.map = { center: { latitude: 0, longitude:0 }, zoom: 13, bounds: {  } , options:{ scrollwheel: false } };


      vm.slider = {
        value: 0,
        options: {
          stepsArray:["Baja","Media","Alta"]
        }
      };


      vm.updateDevice = function(){
          vm.sendingDeviceForm = true;
          DeviceService.UpdateDevice($stateParams.deviceId,vm.device).then(function(response){
            $log.info(response);
            vm.sendingDeviceForm = false;
          })
      }

       vm.unassignDevice = function(){
          vm.sendingDeviceForm = true;
          DeviceService.UnAsignCurrentUserToDevice($stateParams.deviceId,vm.device).then(function(response){
            $log.info(response);
            vm.sendingDeviceForm = false;
             $location.path('/dashboard');
          })
      }

      DeviceService.GetCurrentUserDevice($stateParams.deviceId).then(function(response){
          $log.debug(response);
          if(response.id){
            vm.device = response;
            vm.device.polucion = 0;
            vm.drawGraphFromTime();
            
            DeviceService.GetUserlist($stateParams.deviceId).then(function(response){
              vm.device.users = response;
            });
          }
      });

      vm.drawGraphFromTime = function drawGraphFromTime(){
      
        DeviceService.GetDataPointsFromDate(vm.device.id, 'day').then(function(response){
          if(response.length === 0){
             vm.hasEmptyDatapoints = true;
          }

          vm.device.polucion = calcular(response);

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
            angular.element("#last-time-chart").text("");
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
                xLabels:['minute']
            });
          }
          else if(vm.deviceGraph && response.length > 0){
            vm.deviceGraph.setData(response);
          }else if(response.length === 0){
            angular.element("#last-time-chart").text("No existen datos para graficar");
          }
         
        });
        
      }
      
      function calcular(dataset){

          var data = _.cloneDeep(dataset);
          data = _.sortBy(data, 'value');
          var tenPercent = Math.floor(data.length*0.1);
          data.splice(0,tenPercent);
          data.splice(-1,tenPercent);

          var sortedByDatetimeData = _.sortBy(data, function(item){ (new Date(item.datetime)).getTime(); });

          var averageValue = _.sumBy(data,'value')/data.length;
          var averageTonelaje = _.sumBy(data,'tonelaje')/data.length;
          var averageLLP = _.sumBy(data,'llp_ds')/data.length;
           var totalHours = 0;
          if(sortedByDatetimeData.length > 0 && _.last(sortedByDatetimeData).datetime && _.first(sortedByDatetimeData).datetime)
             totalHours = ( (new Date(_.last(sortedByDatetimeData).datetime)).getTime() - (new Date(_.first(sortedByDatetimeData).datetime)).getTime())/(60*60*1000)
          else
             totalHours = 0;
          if( isNaN(averageValue) || isNaN(averageTonelaje) || isNaN(averageLLP) || isNaN(totalHours)  ){
            $log.error("Uno de los valores esta vacio, y dio como resultado NaN");
            return 0;
          }
          if( totalHours * averageTonelaje  === 0) return 0;
          if( (( averageLLP  ) / (  totalHours * averageTonelaje )) === 0) return 0;
          return Math.floor((1 - ( ( averageValue ) / ( totalHours * averageTonelaje ) ) / ( ( averageLLP  ) / (  totalHours * averageTonelaje ) )*100000))/100000;
      }
  }



})();
