(function() {
  'use strict';
  /*global Morris,_ */
  angular
    .module('webapp')
    .controller('DeviceController', DeviceController);

  /** @ngInject */
  function DeviceController($scope,$log,DeviceService,$stateParams,$location,$filter) {
     
      function getPercentile(data, percentile) {
        var p;
        /**
        * Converts percentile to decimal if necessary
        **/
        if (0 < percentile && percentile < 1) {
            p = percentile;
        } else if (0 < percentile && percentile <= 100) {
            p = percentile * 0.01;
        } else {
            return false;
        }
     
        var numItems = data.length;
        var allIndex = (numItems-1)*p;
        var intIndex = parseInt(allIndex);
        var floatVal = allIndex - intIndex;
        var sortedData = data.sort(function(a, b) {
            return a - b;
        });
        var cutOff = 0;
        if(floatVal % 1 === 0) {
            cutOff = sortedData[intIndex];
        } else {
            if (numItems > intIndex+1) {
                cutOff = floatVal*(sortedData[intIndex+1] - sortedData[intIndex]) + sortedData[intIndex];
            } else {
                cutOff = sortedData[intIndex];
            }
        }
        return cutOff;
      }


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

      vm.mainGrid = {
        enableFiltering: true,
        showGridFooter: true,
        showColumnFooter: true
      };
      vm.filteredGrid = {
        enableFiltering: true,
        showGridFooter: true,
        showColumnFooter: true
      };

      vm.baselineGrid = {
        enableFiltering: true,
        showGridFooter: true,
        showColumnFooter: true
      };

      vm.filteredBaselineGrid = {
        enableFiltering: true,
        showGridFooter: true,
        showColumnFooter: true
      };


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

        logCurrentBaseline();

      }

      function logCurrentBaseline(){
        console.log("XXXX",vm.currentBaseline);
        if(vm.currentBaseline.allvalues){
          vm.baselineGrid.data = vm.currentBaseline.allvalues;

          var values =  _.reject(vm.baselineGrid.data, function(o) { return o.value || o.value === 0; });
          var dataObjArr = _.cloneDeep(values);
          var data = _.cloneDeep(values);
          var filteredData = [];

          data = _.map(data, 'value_baseline');
          data = data.sort(function(a, b){return a-b; });

          var percentil10 = Math.round(getPercentile(data,10)*100)/100; 
          var percentil90 = Math.round(getPercentile(data,90)*100)/100;

          var filtered = [];
        
          for(var index in data){
            var s = data[index];
            if(s >= percentil10 && s < percentil90){
               filtered.push(s);
               filteredData.push(dataObjArr[index]);
            } 
          }

          var sum = 0;
          filtered.forEach(function(item){
            sum = item + sum;
          });

          var averageValue = sum/filtered.length;

          vm.filteredBaselineGrid.data = filteredData;
          vm.filteredBaselineGrid.p10 = percentil10;
          vm.filteredBaselineGrid.p90 = percentil90;
          vm.filteredBaselineGrid.sum = sum;
          vm.filteredBaselineGrid.averageValue = averageValue;

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
                console.log(1);
                 vm.drawGraphFromTime();
              }else{
                console.log(2);
                vm.currentBaseline = vm.availableBaselines[0];
                vm.drawGraphFromTime();
                logCurrentBaseline();
              }

            });

          }
      });

      vm.drawGraphFromTime = function drawGraphFromTime(){
        //return;
        //angular.element("#last-time-chart").text("cargando");
        DeviceService.GetDataPointsFromDate(vm.device.id, vm.viewTimespan ).then(function(response){
          

          vm.mainGrid.data = response;
          
          vm.originalDatapoints = _.cloneDeep(response);
          
          vm.datapoints = response;
        
         

          //if(vm.datapoints.length === 0){
           //  return vm.hasEmptyDatapoints = true;
          //}

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
          var filteredData = [];

          data = _.map(data, 'value');
          data = data.sort(function(a, b){return a-b; });

          var percentil10 = Math.round(getPercentile(data,10)*100)/100; 
          var percentil90 = Math.round(getPercentile(data,90)*100)/100;

          var filtered = [];
        
          for(var index in data){
            var s = data[index];
            if(s >= percentil10 && s < percentil90){
               filtered.push(s);
               filteredData.push(dataObjArr[index]);
            } 
          }

          var sum = 0;
          filtered.forEach(function(item){
            sum = item + sum;
          });

          var averageValue = sum/filtered.length;


          //calcular el min y max con datos filtrados, no a los datos raw

          var sortedByDatetimeData = _.sortBy(filteredData,'datetime' ,function(item){ (new Date(item.datetime)).getTime(); });

          var averageTonelaje = _.sumBy(dataObjArr,'tonelaje')/dataObjArr.length;
          
          var averageBaseline = getBaseline();
            

          var totalHours = 0;
          if(sortedByDatetimeData.length > 0 && _.last(sortedByDatetimeData).datetime && _.first(sortedByDatetimeData).datetime)
             totalHours = ( (new Date(_.last(sortedByDatetimeData).datetime)).getTime() - (new Date(_.first(sortedByDatetimeData).datetime)).getTime())/(60*60*1000)
       
          vm.filteredGrid.p10 = percentil10;
          vm.filteredGrid.p90 = percentil90;
          vm.filteredGrid.sum = sum;
          vm.filteredGrid.data = filteredData;
          vm.filteredGrid.averageValue = averageValue;
          vm.filteredGrid.averageTonelaje = averageTonelaje;
          vm.filteredGrid.averageBaseline = averageBaseline;
          vm.filteredGrid.totalHours = totalHours;
         

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
          
          vm.filteredGrid.indicador = output;

          return output;
      }

      function getBaseline(){
        if(vm.currentBaseline && vm.currentBaseline.baseline)
          return vm.currentBaseline.baseline;
        else
          return 0;
      }



      

  }



})();
