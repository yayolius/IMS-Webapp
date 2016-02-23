(function () {
    'use strict';
 
    angular
        .module('webapp')
        .factory('AuthenticationService', AuthenticationService);
 
    //AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout', 'UserService'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService) {
        var service = {};
 
        service.Login = Login;
        service.Register = Register;
        service.Logout = Logout;
        service.ClearCredentials = ClearCredentials;
        service.ReloadSavedCredentials = ReloadSavedCredentials;
 
        return service;

         function Register(email, password, callback) {
 
            UserService.Create({email:email,password:password})
                .then(function (res) {
                    callback(res);
                });
 
        }
 
        function Login(email, password, callback) {
 
            UserService.Login({email:email,password:password})
                .then(function (response) {
                    if( response.hasOwnProperty('id') ){
                        SetCredentials(response.id,response.userId);
                    }
                    callback(response);
                });
 
        }


        function Logout(callback) {
 
            UserService.Logout()
                .then(function (response) {
                    
                    ClearCredentials();
                    
                    callback(response);
                });
 
        }
 
        function SetCredentials( sesionId, userId) {
          
 
            $rootScope.globals = {
                currentUser: {
                    sesionId: sesionId,
                    userId: userId
                }
            };
 
           // $http.defaults.headers.common['Authorization'] = 'Basic ' + "xxx"; // jshint ignore:line
            $cookies.put('globals.currentUser.sesionId', $rootScope.globals.currentUser.sesionId);
             $cookies.put('globals.currentUser.userId', $rootScope.globals.currentUser.userId);
        }

        function ReloadSavedCredentials(){
            var sesionId = $cookies.get('globals.currentUser.sesionId');
            var userId = $cookies.get('globals.currentUser.userId');
            if(sesionId && userId){
                 $rootScope.globals = {
                    currentUser: {
                        sesionId: sesionId,
                        userId: userId
                    }
                };
            }
        }
 
        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals.currentUser.sesionId');
            $cookies.remove('globals.currentUser.userId');
           // $http.defaults.headers.common.Authorization = 'Basic';
        }
    }
 
 
})();