(function () {
    'use strict';
 
    angular
        .module('webapp')
        .factory('DeviceService', DeviceService);
 
    DeviceService.$inject = ['$http','apiURL','$log','$rootScope'];
    function DeviceService($http,apiURL,$log,$rootScope) {
        var service = {};

        service.All = All;
    
        return service;
 
        function All(data) {
            return $http.post(apiURL + '/api/Devices?access_token=' +  $rootScope.globals.currentUser.sesionId , data).then(handleSuccess, handleError);
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