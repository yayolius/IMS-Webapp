(function() {
  'use strict';
  /*global Morris,_ */
  angular
    .module('webapp')
    .controller('DeviceController', DeviceController);

  /** @ngInject */
  function DeviceController($scope,$log,DeviceService,$stateParams,$location,$filter) {
      
      var vm = this;

      vm.device = { name: ""};
      vm.deviceGraph = null;
      vm.markers = [];
      vm.hasEmptyDatapoints = false;
      vm.datapoints = [];
      vm.reloadTime = 10*1000;
      vm.loadTimeout = null;
      vm.viewTimespan = 'hour';
      vm.lastPolutionVal = 0;
      vm.availableBaselines = [];
      vm.currentBaseline = null;



      $scope.gauge = {
                          columns: 
                              [{
                                  id: "y", // must give it a index
                                  name: "cpu",
                                  type: "gauge"
                              }],   // must be array
                          data: 
                               [{ y: 0 }]  // must be array
                  };

      vm.map = { center: { latitude: 0, longitude:0 }, zoom: 13, bounds: {  } , options:{ scrollwheel: false } };


      vm.slider = {
        value: 0,
        options: {
          stepsArray:["Baja","Media","Alta"],
          disabled: false
        }
      };

      vm.selectBaseline = function(bsline){
        if(!vm.currentBaseline){
          vm.currentBaseline = bsline;
          vm.drawGraphFromTime();
        }else{
          vm.currentBaseline = bsline;
          getLast();
        }
      }


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
            //vm.drawGraphFromTime();
            vm.slider.options.disabled = vm.device.auto_supresor;

             vm.downloadUrls = {
                hour: DeviceService.getUrlForDownload(response.id,'hour'),
                day: DeviceService.getUrlForDownload(response.id,'day'),
                week: DeviceService.getUrlForDownload(response.id,'week'),
                month: DeviceService.getUrlForDownload(response.id,'month'),
                all: DeviceService.getUrlForDownload(response.id,'all')
            };

            DeviceService.GetUserlist($stateParams.deviceId).then(function(response){
              vm.device.users = response;
            });

            DeviceService.GetDataBaselinesFromDate(vm.device.id,'week').then(function(baselines){
              console.log("BASELINES:",baselines)
              vm.availableBaselines = baselines;
              if(vm.availableBaselines == 0){
                 vm.drawGraphFromTime();
              }else{
                vm.currentBaseline = vm.availableBaselines[0];
                vm.drawGraphFromTime();
              }

            });

          }
      });

      vm.drawGraphFromTime = function drawGraphFromTime(){
        //return;
        //angular.element("#last-time-chart").text("cargando");
        DeviceService.GetDataPointsFromDate(vm.device.id, vm.viewTimespan ).then(function(response){
          
          
          vm.originalDatapoints = _.cloneDeep(response);
          
          vm.datapoints = response;
        
         
          if(vm.datapoints.length === 0){
             return vm.hasEmptyDatapoints = true;
          }

 
          $scope.gauge.data[0].y = Math.floor(-1*100*calcular(vm.originalDatapoints));

          var baseline = getBaseline();

          _.remove(vm.datapoints, function(point){  return point.value_baseline || point.value_baseline === 0; });

          vm.lastPolutionVal = _.last(vm.datapoints).value;

          var points = [];
          _.forEach(vm.datapoints,function(res,index){
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
          
          if(vm.device.alert_treadshot) goals = [ vm.device.alert_treadshot , baseline ];

          if(!vm.deviceGraph && vm.datapoints.length > 0){
            angular.element("#last-time-chart").text("");
            vm.deviceGraph =  Morris.Line({
                element: 'last-time-chart',
                data: vm.datapoints,
                xkey: 'datetime',
                ykeys: ['value'],
                labels: ['Value'],
                goals: goals,
                goalLineColors: ['#ff0000','#eea236'],
                pointSize: 0,
                hideHover: 'auto',
                parseTime:true,
                smooth: false,
                lineWidth:2,
                goalStrokeWidth:2,
                xLabels:['minute'],
                hoverCallback: function(index, options, content) {

                    return("<big>"+vm.datapoints[index].value + "</big><br />" + $filter('date')(vm.datapoints[index].datetime, 'EEEE dd/MM/y  HH:mm:ss'));
                }
            });
          }
          else if(vm.deviceGraph && vm.datapoints.length > 0){
            
            console.log(vm.deviceGraph.options.goals, baseline)

            vm.deviceGraph.options.goals = [vm.deviceGraph.options.goals[0],baseline];
            vm.deviceGraph.setData(vm.datapoints);
            

          }else if(vm.datapoints.length === 0){
            angular.element("#last-time-chart").text("No existen datos para graficar");
          }




          

          vm.loadTimeout = setTimeout(function(){ 
            getLast();
          },vm.reloadTime);
         
        });
        
      }


      function getLast(){
            
         DeviceService.GetDataPointsSince(vm.device.id, vm.datapoints[vm.datapoints.length -1].datetime ).then(function(response){
            
            _.forEach(response,function(point){
              vm.datapoints.push(point);
              vm.originalDatapoints.push(_.clone(point));
              if(point.value){
                 vm.lastPolutionVal = point.value;
              }
            });

            $scope.gauge.data[0].y =  Math.floor(-1*100*calcular(vm.originalDatapoints));

            var baseline = getBaseline();

            if(response.length > 0) {
              vm.deviceGraph.options.goals = [vm.deviceGraph.options.goals[0],baseline];
              vm.deviceGraph.setData(vm.datapoints);
              
            }

            vm.loadTimeout = setTimeout(function(){ 
              getLast();
            },vm.reloadTime);

         });

      }

      vm.updateTimespan = function(newTimespan){
        //alert(newTimespan);
        clearTimeout(vm.loadTimeout);
        vm.viewTimespan = newTimespan;
        vm.drawGraphFromTime();

      }
      
      function calcular(dataset){

          var baseline_values =  _.reject(dataset, function(o) { return o.value || o.value === 0; });


          var baseline_data = _.cloneDeep(baseline_values);
          baseline_data = _.sortBy(baseline_data, 'value');
          var baseline_tenPercent = Math.floor(baseline_data.length*0.1);
          baseline_data.splice(0,baseline_tenPercent);
          baseline_data.splice(-1,baseline_tenPercent);


          var values =  _.reject(dataset, function(o) { return o.value_baseline || o.value_baseline === 0; });


          var data = _.cloneDeep(values);
          data = _.sortBy(data, 'value');
          var tenPercent = Math.floor(data.length*0.1);
          data.splice(0,tenPercent);
          data.splice(-1,tenPercent);

          var sortedByDatetimeData = _.sortBy(data,'datetime' ,function(item){ (new Date(item.datetime)).getTime(); });
          var averageValue = _.sumBy(data,'value')/data.length;
          var averageTonelaje = _.sumBy(data,'tonelaje')/data.length;
          
          var averageLLP = getBaseline();
            

          var totalHours = 0;
          if(sortedByDatetimeData.length > 0 && _.last(sortedByDatetimeData).datetime && _.first(sortedByDatetimeData).datetime)
             totalHours = ( (new Date(_.last(sortedByDatetimeData).datetime)).getTime() - (new Date(_.first(sortedByDatetimeData).datetime)).getTime())/(60*60*1000)
         
         /* console.log(
              "averageValue",averageValue,
              "averageTonelaje",averageTonelaje,
              "averageLLP",averageLLP,
              "totalHours",totalHours
          );*/

          if( isNaN(averageValue) || isNaN(averageTonelaje) || isNaN(averageLLP) || isNaN(totalHours)  ){
            $log.error("Uno de los valores esta vacio, y dio como resultado NaN");
            $log.error("isNaN(averageValue)",isNaN(averageValue),"isNaN(averageTonelaje)",isNaN(averageTonelaje),"isNaN(averageLLP ",isNaN(averageLLP),"isNaN(totalHours)",isNaN(totalHours));
            return 0;
          }
          if( totalHours * averageTonelaje  === 0) return 0;
          if( (( averageLLP  ) / (  totalHours * averageTonelaje )) === 0) return 0;
          return Math.floor((1 - ( ( averageValue ) / ( totalHours * averageTonelaje ) ) / ( ( averageLLP  ) / (  totalHours * averageTonelaje ) )*100000))/100000;
      }

      function getBaseline(){
        if(vm.currentBaseline && vm.currentBaseline.baseline)
          return vm.currentBaseline.baseline;
        else
          return 0;
      }
  }



})();
