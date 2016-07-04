(function() {
  'use strict';
  /*global Morris,_ */
  angular
    .module('webapp')
    .controller('DeviceController', DeviceController);

  /** @ngInject */
  function DeviceController($scope,$log,DeviceService,UserService,$stateParams,$location,$filter) {
     

      var vm = this;

      vm.device = { name: ""};
      vm.isUserAdmin = false;
      vm.isUserDeviceAdmin = false;
      vm.deviceGraph = null;
      vm.deviceGraphOptions = null;
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
        //console.log("XXXX",vm.currentBaseline);
        if(vm.currentBaseline && vm.currentBaseline.allvalues){
          vm.baselineGrid.data = vm.currentBaseline.allvalues;

          var values =  _.reject(vm.baselineGrid.data, function(o) { return o.value || o.value === 0; });
          var dataObjArr = _.cloneDeep(values);
          var data = _.cloneDeep(values);
          var filteredData = [];

          data = _.map(data, 'value_baseline');
          data = data.sort(function(a, b){return a-b; });

          var percentil10 = Math.round(getPercentile(data,10)*100)/100; 
          if(vm.device.percentil_inferior)
            percentil10 = vm.device.percentil_inferior;
          var percentil90 = Math.round(getPercentile(data,90)*100)/100;
          if(vm.device.percentil_superior)
            percentil90 = vm.device.percentil_superior;

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
          var sortedByDatetimeData = _.sortBy(filteredData,'datetime' ,function(item){ (new Date(item.datetime)).getTime(); });

          var totalHours = 0;
          if(sortedByDatetimeData.length > 0 && _.last(sortedByDatetimeData).datetime && _.first(sortedByDatetimeData).datetime)
             totalHours = ( (new Date(_.last(sortedByDatetimeData).datetime)).getTime() - (new Date(_.first(sortedByDatetimeData).datetime)).getTime())/(60*60*1000);
       

          vm.filteredBaselineGrid.data = filteredData;
          vm.filteredBaselineGrid.p10 = percentil10;
          vm.filteredBaselineGrid.p90 = percentil90;
          vm.filteredBaselineGrid.sum = sum;
          vm.filteredBaselineGrid.averageValue = averageValue;
          vm.filteredBaselineGrid.totalHours = totalHours;
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
            if(!vm.device.baseline_value){
              alert("No hay una linea base fijada, debe fijar una linea base en el menu superior.");
            }
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


            vm.drawGraphFromTime();
            logCurrentBaseline();

          }
      });

      vm.drawGraphFromTime = function drawGraphFromTime(){

        //return;
        //angular.element("#last-time-chart").text("cargando");
        DeviceService.GetDataPointsFromDate(vm.device.id, vm.viewTimespan ).then(function(response){
          
          console.log(response);
          vm.mainGrid.data = response;
          vm.originalDatapoints = _.cloneDeep(response);
          vm.datapoints = response;

          if(vm.datapoints.length === 0){
             return vm.hasEmptyDatapoints = true;
          }

          calcular(vm.originalDatapoints);
          var calc =  1 - (vm.filteredGrid.averageValue / (vm.filteredGrid.totalHours * vm.filteredGrid.averageTonelaje))   /  (vm.filteredBaselineGrid.averageValue / (vm.filteredBaselineGrid.totalHours * vm.filteredGrid.averageTonelaje)) 

          $scope.gauge.data[0].y  = 100*calc;

          var baseline = getBaseline();
          _.remove(vm.datapoints, function(point){  return point.value_baseline || point.value_baseline === 0; });
          if(_.last(vm.datapoints)) 
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

          if(!vm.deviceGraph && vm.datapoints.length >= 0){
            angular.element("#time-chart").text("");
            
              var dataValues = [];
              var dataBaselines = [];
              var dataTonelajes = [];
              for(var index in vm.originalDatapoints){


                if(vm.originalDatapoints[index].value)
                  dataValues.push( [ (new Date(vm.originalDatapoints[index].datetime)).getTime() , vm.originalDatapoints[index].value]);

                if(vm.originalDatapoints[index].value_baseline)
                  dataBaselines.push( [ (new Date(vm.originalDatapoints[index].datetime)).getTime() , vm.originalDatapoints[index].value_baseline]);

                if(vm.originalDatapoints[index].tonelaje)
                  dataTonelajes.push( [ (new Date(vm.originalDatapoints[index].datetime)).getTime() , vm.originalDatapoints[index].tonelaje]);

              }




              vm.deviceGraphOptions = {
                   chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'Valores del sensor de polución'
                },
                subtitle: {
                    text: document.ontouchstart === undefined ?
                            'Hacer click y arrastrar para acercar.' : 'Tocar el gráfico para acercar.'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: [{
                    max: vm.device.alert_treadshot ,
                    title: {
                        text: 'Valor del sensor'
                    },
                    plotLines: [{
                                    value: baseline,
                                    color: 'green',
                                    dashStyle: 'shortdash',
                                    width: 2,
                                    label: {
                                        text: 'Linea base'
                                    }
                                }, {
                                    value: vm.device.alert_treadshot,
                                    color: 'red',
                                    dashStyle: 'shortdash',
                                    width: 2,
                                    label: {
                                        text: 'Umbral de alerta'
                                    } 
                                },
                                {
                                    value: vm.device.llp_ds,
                                    color: 'green',
                                    dashStyle: 'dash',
                                    width: 1,
                                    label: {
                                        text: 'LLP DS 594'
                                    } 
                                }

                                ]
                },{
                  title: {
                          text: 'Tonelaje'
                  },
                  opposite: true,
                  gridLineWidth: 1
                }
                ],
                legend: {
                    enabled: true
                },
                tooltip: {
                    shared: true
                },
                series: [{
                
                    type: 'line',
                    name: 'Concentración de Polvo (mg/m3)',
                    data: dataValues
                },
                {
                    
                    type: 'line',
                    name: 'Linea base concentración de Polvo (mg/m3)',
                    data: dataBaselines
                },
                {
                    yAxis: 1,
                    type: 'line',
                    name: 'Toneladas de Mineral (ton/hra)',
                    data: dataTonelajes
                }]
            }
            
            if(!vm.device.show_tonelaje){
              options.yAxis.pop();
              options.series.pop();
            }
            
            
            vm.deviceGraph  = $('#time-chart').highcharts(vm.deviceGraphOptions);
            console.log(vm.deviceGraph);
          }
          else if(vm.deviceGraph && vm.datapoints.length > 0){
            
            //console.log(vm.deviceGraph.options.goals, baseline)

            //vm.deviceGraph.options.goals = [vm.deviceGraph.options.goals[0],baseline];
            //vm.deviceGraph.setData(vm.datapoints);
            

          }else if(vm.datapoints.length === 0){
            angular.element("#time-chart").text("No existen datos para graficar");
          }         

          vm.loadTimeout = setTimeout(function(){ 
            getLast();
          },vm.reloadTime);
         
        });
      }

      function getLast(){
            
        DeviceService.GetDataPointsSince(vm.device.id, vm.originalDatapoints[vm.originalDatapoints.length -1].datetime ).then(function(response){
            
          var chart = vm.deviceGraph.highcharts();    

          _.forEach(response,function(point){
              vm.datapoints.push(point);
              vm.originalDatapoints.push(_.clone(point));
              if(point.value){
                 vm.lastPolutionVal = point.value;
              }
              
             

              if(point.value){
                chart.series[0].addPoint(
                    [ (new Date(point.datetime)).getTime() , point.value]
                  , true);
              }
              if(point.value_baseline){
                chart.series[1].addPoint(
                    [ (new Date(point.datetime)).getTime() , point.value_baseline]
                  , true);
              }

              if(point.tonelaje && vm.deviceGraph.length > 2){
                chart.series[2].addPoint(
                    [ (new Date(point.datetime)).getTime() , point.tonelaje]
                  , true);
              }

          });


          calcular(vm.originalDatapoints);
          var calc =  1 - (vm.filteredGrid.averageValue / (vm.filteredGrid.totalHours * vm.filteredGrid.averageTonelaje))   /  (vm.filteredBaselineGrid.averageValue / (vm.filteredBaselineGrid.totalHours * vm.filteredGrid.averageTonelaje)) ;
          $scope.gauge.data[0].y  = 100*calc;
          var baseline = getBaseline();
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

          var sortedByDateUnfilteredTimeData = _.sortBy(dataObjArr,'datetime' ,function(item){ (new Date(item.datetime)).getTime(); });
          if(_.last(sortedByDateUnfilteredTimeData)) {
           var totalHoursUnfiltered = ( (new Date(_.last(sortedByDateUnfilteredTimeData).datetime)).getTime() - (new Date(_.first(sortedByDateUnfilteredTimeData).datetime)).getTime())/(60*60*1000);
          }else{
            var totalHoursUnfiltered = 0;
          }
          var unfilteredProportion =  totalHoursUnfiltered/dataObjArr.length;

          //console.log("UNFILTERED PROPORTION:",unfilteredProportion);


          data = _.map(data, 'value');
          data = data.sort(function(a, b){return a-b; });

           var percentil10 = Math.round(getPercentile(data,10)*100)/100; 
          if(vm.device.percentil_inferior)
            percentil10 = vm.device.percentil_inferior;
          var percentil90 = Math.round(getPercentile(data,90)*100)/100;
          if(vm.device.percentil_superior)
            percentil90 = vm.device.percentil_superior;

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
        if(vm.device.baseline_value)
          return vm.device.baseline_value;
        else
          return 0;
      }


       UserService.isAdmin()
              .then(function (res) {
                if(res && res.is){
                  vm.isUserAdmin = true;
                }
              });

        UserService.isDeviceAdmin(null,$stateParams.deviceId)
                .then(function (res) {   
                  if(res && res.is){
                    vm.isUserDeviceAdmin = true;
                  }
                });

  }

})();
