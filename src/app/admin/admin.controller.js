(function() {
  'use strict';
  /*global Morris,_ */
  angular
    .module('webapp')
    .controller('AdminController', AdminController);

  /** @ngInject */
  function AdminController($scope,$log,DeviceService,UserService,$stateParams,$location,$filter) {
  	var vm = this;
    vm.users = [];
  	UserService.All().then(function(response){
  	    vm.users = response;
        _.forEach(vm.users,function(user){
          (function(u){
            UserService.isAdmin(u.id)
              .then(function (res) {
                console.log(u,res);
                if(res){
                  u.isAdmin = res.is;
                }
              });
             })(user);
            
        });
  	});


    vm.doUnAdmin = function(index){
      
      UserService.RemoveAdminPrivileges( vm.users[index].id)
          .then(function (res) {
              UserService.isAdmin( vm.users[index].id)
              .then(function (res) {
                console.log( vm.users[index],res);
                if(res){
                   vm.users[index].isAdmin = res.is;
                }
              });
          });
    }


    vm.doAdmin = function(index){
      
      UserService.AddAdminPrivileges( vm.users[index].id)
          .then(function (res) {
              UserService.isAdmin( vm.users[index].id)
              .then(function (res) {
                console.log( vm.users[index],res);
                if(res){
                   vm.users[index].isAdmin = res.is;
                }
              });
          });
    }
  }
})();