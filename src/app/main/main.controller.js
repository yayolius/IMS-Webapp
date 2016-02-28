(function() {
  'use strict';
  /*global Morris */
  angular
    .module('webapp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($log,$timeout,UserService) {
      var vm = this;
      vm.deviceCount = "";
      UserService.AllCurrentUserDevices()
                .then(function (res) {
                   vm.deviceCount = res.length?res.length:0;
                   if(vm.deviceCount > 0){
                      initGraph();
                   }
                });


    function initGraph(){
        $timeout(function(){
            Morris.Area({
                element: 'morris-area-chart',
                data: [{
                    period: '2010 Q1',
                    iphone: 8,
                    ipad: null,
                    itouch: 3.2
                }, {
                    period: '2010 Q2',
                    iphone: 7.7,
                    ipad: 3.4,
                    itouch: 4.2
                }, {
                    period: '2010 Q3',
                    iphone: 7.8,
                    ipad: 1.2,
                    itouch: 9.9
                }, {
                    period: '2010 Q4',
                    iphone: 7.8,
                    ipad: 11.1,
                    itouch: 10.1
                }, {
                    period: '2011 Q1',
                    iphone: 12.1,
                    ipad: 9.5,
                    itouch: 3.2
                }, {
                    period: '2011 Q2',
                    iphone: 2.2,
                    ipad: 7.6,
                    itouch: 2.3
                }, {
                    period: '2011 Q3',
                    iphone: 3.6,
                    ipad: 3.4,
                    itouch: 4.6
                }, {
                    period: '2011 Q4',
                    iphone: 2.7,
                    ipad: 8.7,
                    itouch: 7.8
                }, {
                    period: '2012 Q1',
                    iphone: 4.6,
                    ipad: 8.8,
                    itouch: 2.3
                }, {
                    period: '2012 Q2',
                    iphone: 2.8,
                    ipad: 9.6,
                    itouch: 4.4
                }],
                xkey: 'period',
                ykeys: ['iphone', 'ipad', 'itouch'],
                labels: ['Chancador 1', 'Chancador 2', 'Chancador 3'],
                pointSize: 2,
                hideHover: 'auto',
                resize: true
            });
        },1000);
    }

    
  }
})();
