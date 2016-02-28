(function () {
    'use strict';
 
    angular
        .module('webapp')
        .factory('DeviceService', DeviceService);
 
    DeviceService.$inject = ['$http','apiURL','$log','$rootScope'];
    function DeviceService($http,apiURL,$log,$rootScope) {
        var service = {};

        service.All = All;
        service.CreateCurrentUserDevice = CreateCurrentUserDevice;
        service.findByName = findByName;
        service.GetCurrentUserDevice = GetCurrentUserDevice;
        service.GetDataPointsFromDate = GetDataPointsFromDate;
    
        return service;
 

        function All() {
            return $http.get(apiURL + '/api/Devices?access_token=' +  $rootScope.globals.currentUser.sesionId).then(handleSuccess, handleError);
        }

        function CreateCurrentUserDevice(data) {
            return $http.post(apiURL + '/api/Clients/' + $rootScope.globals.currentUser.userId + '/Devices?access_token=' +  $rootScope.globals.currentUser.sesionId , data).then(handleSuccess, handleError);
        }

        function GetCurrentUserDevice(deviceId){
             return $http.get(apiURL + '/api/Clients/' + $rootScope.globals.currentUser.userId + '/Devices/'+ deviceId +'?access_token=' +  $rootScope.globals.currentUser.sesionId ).then(handleSuccess, handleError);
        }

        function findByName(name) {
            return $http.get(apiURL + '/api/Devices?access_token=' +  $rootScope.globals.currentUser.sesionId +"&filter[where][name]="  + encodeURI(name) ).then(handleSuccess, handleError);
        }

         function GetDataPointsFromDate(deviceId, timespan) {
            return $http.get(apiURL + '/api/Devices/'+ deviceId +'/Datapoints/' + timespan + '?access_token=' +  $rootScope.globals.currentUser.sesionId  ).then(handleSuccess, handleError);
        }

     

 
        // private functions
 
        function handleSuccess(res) {
            if(res.data)
                return res.data;
            else
                return {};
        }
 
        function handleError(res) {
            $log.info(res);
            var messages = [];
            if(res.data && res.data.error && res.data.error.details){
                for(var index in res.data.error.details.messages){
                    messages.push( res.data.error.details.messages[index] );
                }
            }else if( res.data.error.message ){
                messages.push(  res.data.error.message );
            }
            
            return { success: false, message: messages.join(", ") };
            
        }
    }
 
})();