(function () {
    'use strict';
 
    angular
        .module('webapp')
        .factory('UserService', UserService);
 
    UserService.$inject = ['$http','apiURL','$log','$rootScope'];
    function UserService($http,apiURL,$log,$rootScope) {
        var service = {};

        service.Create = Create;
        service.Login = Login;
        service.Logout = Logout;
        service.AllCurrentUserDevices = AllCurrentUserDevices;

       /**
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        
        service.Update = Update;
        service.Delete = Delete;
        **/
        
        return service;
 
        function Create(credentials) {
            return $http.post(apiURL + '/api/Clients', credentials).then(handleSuccess, handleError);
        }

        function Login(credentials) {
            return $http.post(apiURL + '/api/Clients/login', credentials).then(handleSuccess, handleError);
        }

        function Logout() {
            return $http.post(apiURL + '/api/Clients/logout?access_token=' +  $rootScope.globals.currentUser.sesionId ).then( handleSuccess,handleError);
        }

        function AllCurrentUserDevices() {
            return $http.get(apiURL + '/api/Clients/' + $rootScope.globals.currentUser.userId + '/Devices?access_token=' +  $rootScope.globals.currentUser.sesionId ).then( handleSuccess,handleError);
        }



        /*
        function GetAll() {
            return $http.get( apiURL + '/api/Clients').then(handleSuccess, handleError);
        }
 
        function GetById(id) {
            return $http.get(apiURL + '/api/Clients/' + id).then(handleSuccess, handleError);
        }
 
        function GetByUsername(username) {
            return $http.get(apiURL + '/api/Clients/' + username).then(handleSuccess, handleError);
        }
 
        function Update(user) {
            return $http.put(apiURL + '/api/Clients/' + user.id, user).then(handleSuccess, handleError);
        }
 
        function Delete(id) {
            return $http.delete(apiURL + '/api/Clients/' + id).then(handleSuccess, handleError);
        }
        */
 
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