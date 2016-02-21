(function () {
    'use strict';
 
    angular
        .module('webapp')
        .factory('UserService', UserService);
 
    UserService.$inject = ['$http','apiURL','$log'];
    function UserService($http,apiURL,$log) {
        var service = {};

        service.Create = Create;
        service.Login = Login;

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        
        service.Update = Update;
        service.Delete = Delete;
 
        return service;
 
        function Create(credentials) {
            return $http.post(apiURL + '/api/Users', credentials).then(handleSuccess, handleError);
        }

        function Login(credentials) {
            return $http.post(apiURL + '/api/Users/login', credentials).then(handleSuccess, handleError);
        }



        function GetAll() {
            return $http.get( apiURL + '/api/Users').then(handleSuccess, handleError);
        }
 
        function GetById(id) {
            return $http.get(apiURL + '/api/Users/' + id).then(handleSuccess, handleError);
        }
 
        function GetByUsername(username) {
            return $http.get(apiURL + '/api/Users/' + username).then(handleSuccess, handleError);
        }
 
        
 
        function Update(user) {
            return $http.put(apiURL + '/api/Users/' + user.id, user).then(handleSuccess, handleError);
        }
 
        function Delete(id) {
            return $http.delete(apiURL + '/api/Users/' + id).then(handleSuccess, handleError);
        }
 
        // private functions
 
        function handleSuccess(res) {
            return res.data;
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