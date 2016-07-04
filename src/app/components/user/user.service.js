(function () {
    'use strict';
 
    angular
        .module('webapp')
        .factory('UserService', UserService);
 
    UserService.$inject = ['$http','apiURL','$log','$rootScope'];
    function UserService($http,apiURL,$log,$rootScope) {
        var service = {};

        service.All = All;
        service.Create = Create;
        service.Login = Login;
        service.Logout = Logout;
        service.GetById = GetById;
        service.isAdmin = isAdmin;
        service.AllCurrentUserDevices = AllCurrentUserDevices;

        service.AddAdminPrivileges = AddAdminPrivileges;
        service.RemoveAdminPrivileges = RemoveAdminPrivileges;

        service.isDeviceAdmin = isDeviceAdmin;
        service.AddDeviceAdminPrivileges = AddDeviceAdminPrivileges;
        service.RemoveDeviceAdminPrivileges = RemoveDeviceAdminPrivileges;

       /**
        service.GetAll = GetAll;
        
        service.GetByUsername = GetByUsername;
        
        service.Update = Update;
        service.Delete = Delete;
        **/
        
        return service;
 
        function All() {
            return $http.get(apiURL + '/api/Clients?access_token=' + getToken()).then(handleSuccess, handleError);
        }
        function Create(credentials) {
            return $http.post(apiURL + '/api/Clients', credentials).then(handleSuccess, handleError);
        }

        function Login(credentials) {
            return $http.post(apiURL + '/api/Clients/login', credentials).then(handleSuccess, handleError);
        }

        function Logout() {
            return $http.post(apiURL + '/api/Clients/logout?access_token=' +  getToken() ).then( handleSuccess,handleError);
        }

        function AllCurrentUserDevices() {
           
            return $http.get(apiURL + '/api/Clients/' + $rootScope.globals.currentUser.userId + '/Devices?access_token=' +  getToken() ).then( handleSuccess,handleError);
        }

        function GetById(id) {
            return $http.get(apiURL + '/api/Clients/' + id + '/?access_token=' + getToken()).then(handleSuccess, handleError);
        }

        function isAdmin(id) {
            if(!id){
                id = $rootScope.globals.currentUser.userId;
            }
            return $http.get(apiURL + '/api/Clients/' + id + '/is/admin?access_token=' + getToken()).then(handleSuccess, handleError);
        }

        function AddAdminPrivileges(id) {
            return $http.get(apiURL + '/api/Clients/' + id + '/set/admin?access_token=' + getToken()).then(handleSuccess, handleError);
        }
        function RemoveAdminPrivileges(id) {
            return $http.get(apiURL + '/api/Clients/' + id + '/unset/admin?access_token=' + getToken()).then(handleSuccess, handleError);
        }
        function isDeviceAdmin(id,deviceid) {
            if(!id){
                id = $rootScope.globals.currentUser.userId;
            }
            return $http.get(apiURL + '/api/Clients/' + id + '/is/Device/'+deviceid+'/admin?access_token=' + getToken()).then(handleSuccess, handleError);
        }
        function AddDeviceAdminPrivileges(id,deviceid) {
            return $http.get(apiURL + '/api/Clients/' + id + '/set/Device/'+deviceid+'/admin?access_token=' + getToken()).then(handleSuccess, handleError);
        }
        function RemoveDeviceAdminPrivileges(id,deviceid) {
            return $http.get(apiURL + '/api/Clients/' + id + '/unset/Device/'+deviceid+'/admin?access_token=' + getToken()).then(handleSuccess, handleError);
        }

        function getToken(){
            var token = "-";
            if( $rootScope.globals &&  $rootScope.globals.currentUser && $rootScope.globals.currentUser.sesionId)
                token =  $rootScope.globals.currentUser.sesionId;
            return token;
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