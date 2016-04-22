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

 
          $scope.gauge.data[0].y = 100*calcular(vm.originalDatapoints);

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

            $scope.gauge.data[0].y =  100*calcular(vm.originalDatapoints);

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

          var values =  _.reject(dataset, function(o) { return o.value_baseline || o.value_baseline === 0; });
          var dataObjArr = _.cloneDeep(values);
          var data = _.cloneDeep(values);

          data = _.map(data, 'value');
          data = data.sort(function(a, b){return a-b; });

          var percentil10 = Math.round(percentile(data,0.1)*100)/100; 
          var percentil90 = Math.round(percentile(data,0.90)*100)/100;

          var filtered = [];
        
          for(var index in data){
            var s = data[index];
            if(s >= percentil10 && s < percentil90){
               filtered.push(s);
            } 
          }

          var sum = 0;
          filtered.forEach(function(item){
            sum = item + sum;
          });

          var averageValue = sum/filtered.length;



          var sortedByDatetimeData = _.sortBy(dataObjArr,'datetime' ,function(item){ (new Date(item.datetime)).getTime(); });

          var averageTonelaje = _.sumBy(dataObjArr,'tonelaje')/dataObjArr.length;
          
          var averageBaseline = getBaseline();
            

          var totalHours = 0;
          if(sortedByDatetimeData.length > 0 && _.last(sortedByDatetimeData).datetime && _.first(sortedByDatetimeData).datetime)
             totalHours = ( (new Date(_.last(sortedByDatetimeData).datetime)).getTime() - (new Date(_.first(sortedByDatetimeData).datetime)).getTime())/(60*60*1000)
         
         

          if( isNaN(averageValue) || isNaN(averageTonelaje) || isNaN(averageBaseline) || isNaN(totalHours)  ){
            $log.error("Uno de los valores esta vacio, y dio como resultado NaN");
            $log.error("isNaN(averageValue)",isNaN(averageValue),"isNaN(averageTonelaje)",isNaN(averageTonelaje),"isNaN(averageBaseline ",isNaN(averageBaseline),"isNaN(totalHours)",isNaN(totalHours));
            return 0;
          }
          if( totalHours * averageTonelaje  === 0) return 0;
          if( (( averageBaseline  ) / (  totalHours * averageTonelaje )) === 0) return 0;
          
          var output =  Math.floor( 
                                    (
                                        1 - 
                                          ( ( averageValue    ) / ( totalHours * averageTonelaje ) )
                                                                / 
                                          ( ( averageBaseline ) / (  totalHours * averageTonelaje ) ) 

                                    ) * 100000
                                  )
                                  / 
                                  100000;
          
          $log.info(
              ( averageBaseline  ) / (  totalHours * averageTonelaje ),
              (  totalHours * averageTonelaje ),
              ( averageValue ) / ( totalHours * averageTonelaje ),
              ( totalHours * averageTonelaje )
          );
           $log.info(

              "averageValue",averageValue,
              "averageTonelaje",averageTonelaje,
              "averageBaseline",averageBaseline,
              "totalHours",totalHours,
              "response", output
          );
          return output;
      }

      function getBaseline(){
        if(vm.currentBaseline && vm.currentBaseline.baseline)
          return vm.currentBaseline.baseline;
        else
          return 0;
      }



      function percentile(arr, p) {
        if (arr.length === 0) return 0;
        if (typeof p !== 'number') throw new TypeError('p must be a number');
        if (p <= 0) return arr[0];
        if (p >= 1) return arr[arr.length - 1];

        var index = arr.length * p,
            lower = Math.floor(index),
            upper = lower + 1,
            weight = Math.floor((index % 1)*100)/100;
      
     

        if (upper >= arr.length){ return arr[lower]; }
     
      
      
        return arr[lower] * (1 - weight) + arr[upper] * weight;
      }

      // Returns the percentile of the given value in a sorted numeric array.
      function percentRank(arr, v) {
        if (typeof v !== 'number') throw new TypeError('v must be a number');
        for (var i = 0, l = arr.length; i < l; i++) {
            if (v <= arr[i]) {
                while (i < l && v === arr[i]) i++;
                if (i === 0) return 0;
                if (v !== arr[i-1]) {
                    i += (v - arr[i-1]) / (arr[i] - arr[i-1]);
                }
                return i / l;
            }
        }
        return 1;
      }

  }



})();
