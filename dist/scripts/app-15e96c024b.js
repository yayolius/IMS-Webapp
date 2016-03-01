/*
$(function() {

   

    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
            label: "Download Sales",
            value: 12
        }, {
            label: "In-Store Sales",
            value: 30
        }, {
            label: "Mail-Order Sales",
            value: 20
        }],
        resize: true
    });

    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            y: '2006',
            a: 100,
            b: 90
        }, {
            y: '2007',
            a: 75,
            b: 65
        }, {
            y: '2008',
            a: 50,
            b: 40
        }, {
            y: '2009',
            a: 75,
            b: 65
        }, {
            y: '2010',
            a: 50,
            b: 40
        }, {
            y: '2011',
            a: 75,
            b: 65
        }, {
            y: '2012',
            a: 100,
            b: 90
        }],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        hideHover: 'auto',
        resize: true
    });

});
*/
!function(){"use strict";angular.module("webapp",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngMessages","ngAria","ngResource","ui.router","toastr","validation.match","uiGmapgoogle-maps","rzModule"])}(),function(){"use strict";function e(){function e(){return a}var a=[{title:"AngularJS",url:"https://angularjs.org/",description:"HTML enhanced for web apps!",logo:"angular.png"},{title:"BrowserSync",url:"http://browsersync.io/",description:"Time-saving synchronised browser testing.",logo:"browsersync.png"},{title:"GulpJS",url:"http://gulpjs.com/",description:"The streaming build system.",logo:"gulp.png"},{title:"Jasmine",url:"http://jasmine.github.io/",description:"Behavior-Driven JavaScript.",logo:"jasmine.png"},{title:"Karma",url:"http://karma-runner.github.io/",description:"Spectacular Test Runner for JavaScript.",logo:"karma.png"},{title:"Protractor",url:"https://github.com/angular/protractor",description:"End to end test framework for AngularJS applications built on top of WebDriverJS.",logo:"protractor.png"},{title:"Bootstrap",url:"http://getbootstrap.com/",description:"Bootstrap is the most popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web.",logo:"bootstrap.png"},{title:"Less",url:"http://lesscss.org/",description:"Less extends the CSS language, adding features that allow variables, mixins, functions and many other techniques.",logo:"less.png"}];this.getTec=e}angular.module("webapp").service("webDevTec",e)}(),function(){"use strict";function e(e,a,s,t){function o(s){return e.post(a+"/api/Clients",s).then(l,c)}function i(s){return e.post(a+"/api/Clients/login",s).then(l,c)}function n(){return e.post(a+"/api/Clients/logout?access_token="+t.globals.currentUser.sesionId).then(l,c)}function r(){return e.get(a+"/api/Clients/"+t.globals.currentUser.userId+"/Devices?access_token="+t.globals.currentUser.sesionId).then(l,c)}function l(e){return e.data?e.data:{}}function c(e){s.info(e);var a=[];if(e.data&&e.data.error&&e.data.error.details)for(var t in e.data.error.details.messages)a.push(e.data.error.details.messages[t]);else e.data.error.message&&a.push(e.data.error.message);return{success:!1,message:a.join(", ")}}var d={};return d.Create=o,d.Login=i,d.Logout=n,d.AllCurrentUserDevices=r,d}angular.module("webapp").factory("UserService",e),e.$inject=["$http","apiURL","$log","$rootScope"]}(),function(){"use strict";function e(){return{restrict:"A",link:function(e,a,s){a.bind("click",function(){var a=s.ngReallyMessage;a&&confirm(a)&&e.$apply(s.ngReallyClick)})}}}angular.module("webapp").directive("ngReallyClick",e)}(),function(){"use strict";function e(){function e(){}var a={restrict:"E",templateUrl:"app/components/navhead/navhead.html",scope:{creationDate:"="},controller:e,controllerAs:"vm",bindToController:!0};return a}angular.module("webapp").directive("headerNavbar",e)}(),function(){"use strict";function e(){function e(e,a){var s=this;s.deviceCount=0,s.devices=[],a.AllCurrentUserDevices().then(function(e){s.deviceCount=e.length?e.length:0,s.deviceCount>0&&(s.devices=e)}),s.relativeDate=e(s.creationDate).fromNow()}e.$inject=["moment","UserService"];var a={restrict:"E",templateUrl:"app/components/navbar/navbar.html",scope:{creationDate:"="},controller:e,controllerAs:"vm",bindToController:!0};return a}angular.module("webapp").directive("acmeNavbar",e)}(),function(){"use strict";function e(e,a,s,t){function o(){return e.get(a+"/api/Devices?access_token="+t.globals.currentUser.sesionId).then(u,m)}function i(s){return e.post(a+"/api/Clients/"+t.globals.currentUser.userId+"/Devices?access_token="+t.globals.currentUser.sesionId,s).then(u,m)}function n(s){return e.get(a+"/api/Clients/"+t.globals.currentUser.userId+"/Devices/"+s+"?access_token="+t.globals.currentUser.sesionId).then(u,m)}function r(s){return e.get(a+"/api/Devices?access_token="+t.globals.currentUser.sesionId+"&filter[where][name]="+encodeURI(s)).then(u,m)}function l(s,o){return e.get(a+"/api/Devices/"+s+"/Datapoints/"+o+"?access_token="+t.globals.currentUser.sesionId).then(u,m)}function c(s){return e.get(a+"/api/Devices/"+s+"/Clients?access_token="+t.globals.currentUser.sesionId).then(u,m)}function d(s,o){return e.put(a+"/api/Devices/"+s+"?access_token="+t.globals.currentUser.sesionId,o).then(u,m)}function v(s){return e.put(a+"/api/Devices/"+s+"/Clients/rel/"+t.globals.currentUser.userId+"?access_token="+t.globals.currentUser.sesionId).then(u,m)}function p(s){return e["delete"](a+"/api/Devices/"+s+"/Clients/rel/"+t.globals.currentUser.userId+"?access_token="+t.globals.currentUser.sesionId).then(u,m)}function u(e){return e.data?e.data:{}}function m(e){s.info(e);var a=[];if(e.data&&e.data.error&&e.data.error.details)for(var t in e.data.error.details.messages)a.push(e.data.error.details.messages[t]);else e.data.error.message&&a.push(e.data.error.message);return{success:!1,message:a.join(", ")}}var g={};return g.All=o,g.CreateCurrentUserDevice=i,g.findByName=r,g.GetCurrentUserDevice=n,g.GetDataPointsFromDate=l,g.GetUserlist=c,g.UpdateDevice=d,g.AssignCurrentUserToDevice=v,g.UnAsignCurrentUserToDevice=p,g}angular.module("webapp").factory("DeviceService",e),e.$inject=["$http","apiURL","$log","$rootScope"]}(),function(){"use strict";function e(e,a){function s(s){function o(e){return e.data}function i(a){e.error("XHR Failed for getContributors.\n"+angular.toJson(a.data,!0))}return s||(s=30),a.get(t+"/contributors?per_page="+s).then(o)["catch"](i)}var t="https://api.github.com/repos/Swiip/generator-gulp-angular",o={apiHost:t,getContributors:s};return o}e.$inject=["$log","$http"],angular.module("webapp").factory("githubContributor",e)}(),function(){"use strict";function e(e){function a(a,s,t,o){var i,n=e(s[0],{typeSpeed:40,deleteSpeed:40,pauseDelay:800,loop:!0,postfix:" "});s.addClass("acme-malarkey"),angular.forEach(a.extraValues,function(e){n.type(e).pause()["delete"]()}),i=a.$watch("vm.contributors",function(){angular.forEach(o.contributors,function(e){n.type(e.login).pause()["delete"]()})}),a.$on("$destroy",function(){i()})}function s(e,a){function s(){return t().then(function(){e.info("Activated Contributors View")})}function t(){return a.getContributors(10).then(function(e){return o.contributors=e,o.contributors})}var o=this;o.contributors=[],s()}s.$inject=["$log","githubContributor"];var t={restrict:"E",scope:{extraValues:"="},template:"&nbsp;",link:a,controller:s,controllerAs:"vm"};return t}e.$inject=["malarkey"],angular.module("webapp").directive("acmeMalarkey",e)}(),function(){"use strict";function e(e,a,s,t,o){function i(e,a,s){o.Create({email:e,password:a}).then(function(e){s(e)})}function n(e,a,s){o.Login({email:e,password:a}).then(function(e){e.hasOwnProperty("id")&&l(e.id,e.userId),s(e)})}function r(e){o.Logout().then(function(a){d(),e(a)})}function l(e,t){s.globals={currentUser:{sesionId:e,userId:t}},a.put("globals.currentUser.sesionId",s.globals.currentUser.sesionId),a.put("globals.currentUser.userId",s.globals.currentUser.userId)}function c(){var e=a.get("globals.currentUser.sesionId"),t=a.get("globals.currentUser.userId");e&&t&&(s.globals={currentUser:{sesionId:e,userId:t}})}function d(){s.globals={},a.remove("globals.currentUser.sesionId"),a.remove("globals.currentUser.userId")}var v={};return v.Login=n,v.Register=i,v.Logout=r,v.ClearCredentials=d,v.ReloadSavedCredentials=c,v}e.$inject=["$http","$cookies","$rootScope","$timeout","UserService"],angular.module("webapp").factory("AuthenticationService",e)}(),function(){"use strict";function e(e,a){var s=this;s.email="",s.password="",s.password2="",s.errorMessage="",s.showSuccess=!1,s.register=function(){e.form.$valid&&(s.errorMessage="",a.Register(s.email,s.password,function(e){e.hasOwnProperty("success")&&e.success===!1?s.errorMessage=e.message:e.hasOwnProperty("email")&&e.hasOwnProperty("id")&&(s.showSuccess=!0)}))}}e.$inject=["$scope","AuthenticationService"],angular.module("webapp").controller("RegisterController",e)}(),function(){"use strict";function e(e,a,s,t){function o(e){i.datapoints.length?Morris.Area({element:"morris-area-chart",data:i.datapoints,xkey:"datetime",ykeys:_.map(e,"id"),labels:_.map(e,"name"),pointSize:0,hideHover:!0,resize:!0}):i.nodata=!0}var i=this;i.deviceCount=0,i.datapoints=[],i.nodata=!1;var n=0;s.AllCurrentUserDevices().then(function(e){i.deviceCount=e.length,_.forEach(e,function(a){t.GetDataPointsFromDate(a.id,"hour").then(function(s){_.forEach(s,function(e){var s={datetime:e.datetime};s[a.id]=e.value,i.datapoints.push(s)}),n++,n==i.deviceCount&&o(e)})})})}e.$inject=["$log","$timeout","UserService","DeviceService"],angular.module("webapp").controller("MainController",e)}(),function(){"use strict";function e(e,a,s){a.Logout(function(){s.path("/login")})}e.$inject=["$scope","AuthenticationService","$location"],angular.module("webapp").controller("LogoutController",e)}(),function(){"use strict";function e(e,a,s,t){var o=this;o.email="",o.password="",o.rememberme=!1,o.showSuccess=!1,o.errorMessage="",o.login=function(){e.form.$valid&&(o.errorMessage="",a.Login(o.email,o.password,function(e){t.debug(e),e.hasOwnProperty("success")&&e.success===!1?o.errorMessage=e.message:e.hasOwnProperty("id")&&e.hasOwnProperty("userId")&&(o.showSuccess=!0,s.path("/dashboard"))}))}}e.$inject=["$scope","AuthenticationService","$location","$log"],angular.module("webapp").controller("LoginController",e)}(),function(){"use strict";function e(e,a,s,t,o){function i(e){var s=_.cloneDeep(e);s=_.sortBy(s,"value");var t=Math.floor(.1*s.length);s.splice(0,t),s.splice(-1,t);var o=_.sortBy(s,function(e){new Date(e.datetime).getTime()}),i=_.sumBy(s,"value")/s.length,n=_.sumBy(s,"tonelaje")/s.length,r=_.sumBy(s,"llp_ds")/s.length,l=0;return l=o.length>0&&_.last(o).datetime&&_.first(o).datetime?(new Date(_.last(o).datetime).getTime()-new Date(_.first(o).datetime).getTime())/36e5:0,isNaN(i)||isNaN(n)||isNaN(r)||isNaN(l)?(a.error("Uno de los valores esta vacio, y dio como resultado NaN"),0):l*n===0?0:r/(l*n)===0?0:Math.floor(1-i/(l*n)/(r/(l*n))*1e5)/1e5}var n=this;n.device={name:""},n.deviceGraph=null,n.markers=[],n.hasEmptyDatapoints=!1,n.map={center:{latitude:0,longitude:0},zoom:13,bounds:{},options:{scrollwheel:!1}},n.slider={value:0,options:{stepsArray:["Baja","Media","Alta"]}},n.updateDevice=function(){n.sendingDeviceForm=!0,s.UpdateDevice(t.deviceId,n.device).then(function(e){a.info(e),n.sendingDeviceForm=!1})},n.unassignDevice=function(){n.sendingDeviceForm=!0,s.UnAsignCurrentUserToDevice(t.deviceId,n.device).then(function(e){a.info(e),n.sendingDeviceForm=!1,o.path("/dashboard")})},s.GetCurrentUserDevice(t.deviceId).then(function(e){a.debug(e),e.id&&(n.device=e,n.device.polucion=0,n.drawGraphFromTime(),s.GetUserlist(t.deviceId).then(function(e){n.device.users=e}))}),n.drawGraphFromTime=function(){s.GetDataPointsFromDate(n.device.id,"day").then(function(e){0===e.length&&(n.hasEmptyDatapoints=!0),n.device.polucion=i(e);var a=[];_.forEach(e,function(e,s){if(e.gps){var t=!1;_.forEach(a,function(a){a.latitude==e.gps.lat&&a.longitude==e.gps.lng&&(t=!0)}),t||a.push({latitude:e.gps.lat,longitude:e.gps.lng,id:s})}}),n.markers=a,a.length>0&&(n.map.center=_.cloneDeep(a[0]),delete n.map.center.index);var s=[];n.device.alert_treadshot&&s.push(n.device.alert_treadshot),!n.deviceGraph&&e.length>0?(angular.element("#last-time-chart").text(""),n.deviceGraph=Morris.Line({element:"last-time-chart",data:e,xkey:"datetime",ykeys:["value"],labels:["Value"],goals:s,goalLineColors:["#ff0000"],pointSize:0,hideHover:"auto",parseTime:!0,resize:!0,smooth:!1,lineWidth:2,goalStrokeWidth:2,xLabels:["minute"]})):n.deviceGraph&&e.length>0?n.deviceGraph.setData(e):0===e.length&&angular.element("#last-time-chart").text("No existen datos para graficar")})}}e.$inject=["$scope","$log","DeviceService","$stateParams","$location"],angular.module("webapp").controller("DeviceController",e)}(),function(){"use strict";function e(e,a,s){var t=this;t.deviceCount="",t.errorMessage="",t.processingName=!1,t.deviceId="",t.deviceName="",t.deviceType="polucion-simple",t.deviceGPS={lat:"",lng:""},t.deviceMode="linea-base",t.deviceReadType="polvo-total",t.deviceLlpDs="",t.deviceTonelaje="",t.deviceUmbralAlerta="",t.sendingDeviceForm=!1,t.status={screen:"name",nameFound:!1,nameNotFound:!1},t.validateAndAssign=function(){t.processingName=!0,s.findByName(t.deviceName).then(function(s){e.debug(s),t.processingName=!1,1==s.length?(t.deviceId=s[0].id,a.AllCurrentUserDevices().then(function(e){var a=!1;if(t.deviceCount=e.length?e.length:0,t.deviceCount>0)for(var o in e){var i=e[o];i.id==s[0].id&&(a=!0)}a?(t.status.nameFound=!0,t.status.nameNotFound=!1,t.status.screen="already-asigned"):(t.status.nameFound=!0,t.status.nameNotFound=!1,t.status.screen="confirm")})):(t.status.nameFound=!1,t.status.nameNotFound=!0,t.status.screen="confirm")})},t.backToName=function(){t.status.nameFound=!1,t.status.nameNotFound=!1,t.status.screen="name"},t.createNewDevice=function(){t.status.screen="create"},t.assignNewDevice=function(){s.AssignCurrentUserToDevice(t.deviceId).then(function(a){t.status.screen="success-assign",e.info(a)})},t.saveNewDevice=function(){var a={name:t.deviceName,type:t.deviceType,gps:t.deviceGPS,mode:t.deviceMode,read_type:t.deviceReadType,llp_ds:t.deviceLlpDs,tonelaje:t.deviceTonelaje,alert_treadshot:t.deviceUmbralAlerta};a.gps||delete a.gps,a.llp_ds||delete a.llp_ds,a.tonelaje||delete a.tonelaje,a.alert_treadshot||delete a.alert_treadshot,s.CreateCurrentUserDevice(a).then(function(a){e.debug(a),a.id&&(t.status.screen="success-add",t.deviceId=a.id)})}}e.$inject=["$log","UserService","DeviceService"],angular.module("webapp").controller("DeviceAssignController",e)}(),function(){"use strict";function e(e,a,s,t,o,i){i.ReloadSavedCredentials();var n=a.$on("$locationChangeStart",function(){a.$on("$destroy",n);var e=-1===$.inArray(s.path(),["/login","/register"]),t=!1;a.globals&&a.globals.currentUser&&(t=a.globals.currentUser),e&&!t&&s.path("/login")});e.debug("runBlock end")}e.$inject=["$log","$rootScope","$location","$cookies","$http","AuthenticationService"],angular.module("webapp").run(e)}(),function(){"use strict";function e(e,a){e.state("home",{url:"/dashboard",templateUrl:"app/main/main.html",controller:"MainController",controllerAs:"vm"}).state("login",{url:"/login",templateUrl:"app/login/login.html",controller:"LoginController",controllerAs:"vm"}).state("register",{url:"/register",templateUrl:"app/register/register.html",controller:"RegisterController",controllerAs:"vm"}).state("logout",{url:"/logout",templateUrl:"app/logout/logout.html",controller:"LogoutController",controllerAs:"vm"}).state("devices-assign",{url:"/devices/assign",templateUrl:"app/assignDevice/assign.device.html",controller:"DeviceAssignController",controllerAs:"vm"}).state("device",{url:"/devices/:deviceId",templateUrl:"app/device/device.html",controller:"DeviceController",controllerAs:"vm"}),a.otherwise("/login")}e.$inject=["$stateProvider","$urlRouterProvider"],angular.module("webapp").config(e)}(),function(){"use strict";angular.module("webapp").constant("malarkey",malarkey).constant("moment",moment).constant("apiURL","http://159.203.114.208:3000")}(),function(){"use strict";function e(e,a){e.debugEnabled(!0),a.allowHtml=!0,a.timeOut=3e3,a.positionClass="toast-top-right",a.preventDuplicates=!0,a.progressBar=!0}e.$inject=["$logProvider","toastrConfig"],angular.module("webapp").config(e)}(),angular.module("webapp").run(["$templateCache",function(e){e.put("app/assignDevice/assign.device.html",'<div id="wrapper"><nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0"><header-navbar></header-navbar><acme-navbar></acme-navbar></nav><div id="page-wrapper"><div class="row"><div class="col-lg-12"><h1 class="page-header">Agregar Dispositivo</h1></div></div><div class="row"><div class="col-lg-12"><div class="col-md-6 col-md-offset-3"><div class="panel"><div class="panel-body"><form ng-if="vm.status.screen == \'name\'" name="formName" novalidate="" role="form"><fieldset><p class="bg-danger pildorita" ng-show="vm.errorMessage != \'\'">{{errorMessage}}</p><div class="form-group"><input class="form-control" ng-model="vm.deviceName" placeholder="Identificador del dispositivo" name="deviceName" type="text" minlength="3" required=""><p><small>Ingrese el identificador del dispositivo que puede encontrar en ...</small></p><input ng-disabled="!formName.$valid" type="submit" ng-click="vm.validateAndAssign()" class="btn btn-lg btn-success btn-block" value="Validar & asignar"></div></fieldset></form><form ng-if="vm.status.screen == \'confirm\'" name="formConfirm" novalidate="" role="form"><fieldset ng-if="vm.status.nameNotFound === true"><div class="form-group"><p>El dispositivo<big><strong>{{vm.deviceName}}</strong> <strong class="text-danger">NO FUE ENCONTRADO</strong></big>, esto se puede deber a que el nombre esta mal escrito, o el dispositivo no ha sido creado por ningún usuario en el sistema.</p><div class="col-md-6"><input type="submit" ng-click="vm.createNewDevice()" class="btn btn-success btn-block" value="Agregar dispositivo"></div><div class="col-md-6"><input type="submit" ng-click="vm.backToName()" class="btn btn-info btn-block" value="Volver a intentar"></div></div></fieldset><fieldset ng-if="vm.status.nameFound === true"><div class="form-group"><p>El dispositivo<big><strong>FUE ENCONTRADO con exito</strong></big>, esto significa que ya fue creado por otro usuario, asignando el dispositivo tendra acceso a sus gráficos y alertas.</p><div class="col-md-6"><input type="submit" ng-click="vm.assignNewDevice()" class="btn btn-lg btn-success btn-block" value="Asignar dispositivo"></div><div class="col-md-6"><input type="submit" ng-click="vm.backToName()" class="btn btn-lg btn-info btn-block" value="Volver a intentar"></div></div></fieldset></form><form ng-if="vm.status.screen == \'create\'" name="formCreateDevice" novalidate="" role="form" class="form-horizontal"><fieldset><div class="form-group"><label class="col-md-4" for="">Nombre:</label><div class="col-md-8"><input class="form-control" ng-model="vm.deviceName" name="deviceName" readonly="true" type="text"></div></div><div class="form-group"><label class="col-md-4" for="">Tipo de sensor</label><div class="col-md-8"><select class="form-control" name="deviceType" ng-model="vm.deviceType"><option value="polucion-simple">Polución simple</option><option value="polucion-gps">Polución simple con gps</option></select></div></div><div class="form-group"><label class="col-md-4" for="">Ubicacion GPS Latitud</label><div class="col-md-8"><input class="form-control" ng-model="vm.deviceGPS.lat" placeholder="Ejemplo: -10.323243232" name="deviceGPSLat" type="text"></div></div><div class="form-group"><label class="col-md-4" for="">Ubicacion GPS Longitud</label><div class="col-md-8"><input class="form-control" ng-model="vm.deviceGPS.lng" placeholder="Ejemplo: -10.323243232" name="deviceGPSLat" type="text"></div></div><div class="form-group"><label class="col-md-4" for="">Modo de lectura</label><div class="col-md-8"><select class="form-control" name="deviceMode" ng-model="vm.deviceMode"><option value="linea-base" selected="selected">Linea base</option><option value="ssp">SSP</option></select></div></div><div class="form-group"><label class="col-md-4" for="">Tipo de medición</label><div class="col-md-8"><select class="form-control" name="deviceReadType" ng-model="vm.deviceReadType"><option value="polvo-total" selected="selected">Polvo Total</option><option value="pm10">PM10</option><option value="pm2.5">PM2.5</option></select></div></div><div class="form-group"><label class="col-md-4" for="">LLP DS</label><div class="col-md-8"><input class="form-control" ng-model="vm.deviceLlpDs" placeholder="" name="deviceLlpDs" type="text"></div></div><div class="form-group"><label class="col-md-4" for="">Tonelaje</label><div class="col-md-8"><input class="form-control" ng-model="vm.deviceTonelaje" placeholder="" name="deviceTonelaje" type="text"></div></div><div class="form-group"><label class="col-md-4" for="">Umbral de Alerta</label><div class="col-md-8"><input class="form-control" ng-model="vm.deviceUmbralAlerta" placeholder="" name="deviceUmbralAlerta" type="text"></div></div><div class="form-group"><input type="submit" ng-disabled="!formCreateDevice.$valid" ng-click="vm.saveNewDevice()" class="btn btn-lg btn-success btn-block" value="Crear dispositivo"></div></fieldset></form><form ng-if="vm.status.screen == \'success-add\'" name="formCreatedSuccess" novalidate="" role="form"><fieldset><p>El dispositivo fue agregado con éxito.</p><a ng-href="#/devices/{{vm.deviceId}}" class="btn btn-lg btn-success btn-block">Ver Dispositivo</a></fieldset></form><form ng-if="vm.status.screen == \'success-assign\'" name="formAssignedSuccess" novalidate="" role="form"><fieldset><p>El dispositivo fue asignado con éxito.</p><a ng-href="#/devices/{{vm.deviceId}}" class="btn btn-lg btn-success btn-block">Ver Dispositivo</a></fieldset></form><form ng-if="vm.status.screen == \'already-asigned\'" name="formCreatedSuccess" novalidate="" role="form"><fieldset><p>El dispositivo ya pertenece al usuario.</p><a ng-href="#/devices/{{vm.deviceId}}" class="btn btn-lg btn-success btn-block">Ver Dispositivo</a></fieldset></form></div></div></div></div></div></div></div>'),e.put("app/device/device.html",'<div id="wrapper"><nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0"><header-navbar></header-navbar><acme-navbar></acme-navbar></nav><div id="page-wrapper"><div class="row"><div class="col-lg-12"><h1 class="page-header">Dispositivo {{vm.device.name}}</h1></div></div><div class="row"><div class="col-md-6"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Último valor de la polución (mg/m3)</h3></div><div class="panel-body"><h3 class="text-center text-success">{{vm.device.polucion}} (mg/m3)</h3></div></div></div><div class="col-md-6"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Sensibilidad</h3></div><div class="panel-body"><rzslider rz-slider-model="vm.slider.value" rz-slider-options="vm.slider.options"></rzslider></div></div></div></div><div class="row" ng-if="vm.hasEmptyDatapoints"><div class="col-md-12"><h3 class="text-danger text-center">No se han recibido datos en la última hora</h3><p>&nbsp;</p><p>&nbsp;</p></div></div><div class="row" ng-if="!vm.hasEmptyDatapoints"><div class="col-md-12"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Polución <strong>Última Hora</strong> (mg/m3)</h3></div><div class="panel-body"><div id="last-time-chart" class="text-center">Cargando gráfico ...</div></div></div></div></div><div class="row" ng-if="vm.markers.length > 0 && !vm.hasEmptyDatapoints"><div class="col-md-12"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">GPS</h3></div><div class="panel-body"><ui-gmap-google-map center="vm.map.center" zoom="vm.map.zoom" bounds="vm.map.bounds" options="vm.map.options"><ui-gmap-markers fit="true" models="vm.markers" coords="\'self\'" icon="\'icon\'"></ui-gmap-markers></ui-gmap-google-map></div></div></div></div><div class="row"><div class="col-md-6"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Configuración del Dispositivo</h3></div><div class="panel-body"><form name="formUpdateDevice" novalidate="" role="form" class="form-horizontal"><fieldset><div class="form-group"><label class="col-md-4" for="">Nombre:</label><div class="col-md-8"><input class="form-control" ng-model="vm.device.name" name="deviceName" readonly="true" type="text"></div></div><div class="form-group"><label class="col-md-4" for="">Tipo de sensor</label><div class="col-md-8"><select class="form-control" name="deviceType" ng-model="vm.device.type"><option value="polucion-simple">Polución simple</option><option value="polucion-gps">Polución simple con gps</option></select></div></div><div class="form-group"><label class="col-md-4" for="">Ubicacion GPS Latitud</label><div class="col-md-8"><input class="form-control" ng-model="vm.device.gps.lat" placeholder="Ejemplo: -10.323243232" name="deviceGPSLat" type="text"></div></div><div class="form-group"><label class="col-md-4" for="">Ubicacion GPS Longitud</label><div class="col-md-8"><input class="form-control" ng-model="vm.device.gps.lng" placeholder="Ejemplo: -10.323243232" name="deviceGPSLat" type="text"></div></div><div class="form-group"><label class="col-md-4" for="">Modo de lectura</label><div class="col-md-8"><select class="form-control" name="deviceMode" ng-model="vm.device.mode"><option value="linea-base" selected="selected">Linea base</option><option value="ssp">SSP</option></select></div></div><div class="form-group"><label class="col-md-4" for="">Tipo de medición</label><div class="col-md-8"><select class="form-control" name="deviceReadType" ng-model="vm.device.read_type"><option value="polvo-total" selected="selected">Polvo Total</option><option value="pm10">PM10</option><option value="pm2.5">PM2.5</option></select></div></div><div class="form-group"><label class="col-md-4" for="">LLP DS</label><div class="col-md-8"><input class="form-control" ng-model="vm.device.llp_ds" placeholder="" name="deviceLlpDs" type="text"></div></div><div class="form-group"><label class="col-md-4" for="">Tonelaje</label><div class="col-md-8"><input class="form-control" ng-model="vm.device.tonelaje" placeholder="" name="deviceTonelaje" type="text"></div></div><div class="form-group"><label class="col-md-4" for="">Umbral de Alerta</label><div class="col-md-8"><input class="form-control" ng-model="vm.device.alert_treadshot" placeholder="" name="deviceUmbralAlerta" type="text"></div></div><div class="form-group"><input type="submit" ng-disabled="vm.sendingDeviceForm" ng-click="vm.updateDevice()" class="btn btn-lg btn-success btn-block" value="Actualizar configuración"></div></fieldset></form></div></div></div><div class="col-md-6"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Email de usuarios asociados a este dispositivo</h3></div><div class="panel-body"><ul class="list-group"><li class="list-group-item" ng-repeat="user in vm.device.users">{{user.email}}</li></ul></div></div><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Administración</h3></div><div class="panel-body"><form name="formUnassignDevice" novalidate="" role="form"><fieldset><div class="form-group"><input type="submit" ng-disabled="vm.sendingDeviceForm" class="btn btn-lg btn-danger btn-block" value="Remover dispositivo de mi cuenta" ng-really-message="Esta seguro que desea remover este dispositivo de su cuenta?" ng-really-click="vm.unassignDevice()"></div></fieldset></form></div></div></div></div></div></div>'),e.put("app/login/login.html",'<div class="container"><div class="row"><div class="col-md-4 col-md-offset-4"><div class="login-panel panel panel-default"><div class="panel-heading text-center"><h3 class="panel-title"><img src="assets/images/logo_IMS.png" style="width:40%"></h3></div><div class="panel-body"><form name="form" novalidate="" role="form"><fieldset><p class="bg-danger pildorita" ng-show="vm.errorMessage != \'\'">{{errorMessage}}</p><div class="form-group"><input class="form-control" ng-model="vm.email" placeholder="Correo" name="email" type="email" required=""> <span class="text-danger" ng-show="form.$submitted && form.email.$error.required">El email es obligatorio</span> <span class="text-danger" ng-show="form.$submitted && form.email.$error.email">El email ingresado es inválido</span></div><div class="form-group"><input class="form-control" ng-model="vm.password" placeholder="Password" name="password" type="password" value="" required="" minlength="5"> <span class="text-danger" ng-show="form.$submitted && form.password.$error.required">El password es obligatorio</span> <span class="text-danger" ng-show="form.$submitted && form.password.$error.minlength">El password debe tener al menos 5 caracteres</span></div><div class="checkbox"><label><input ng-model="vm.rememberme" name="remember" type="checkbox" value="Recordarme">Recordarme</label></div><input type="submit" ng-click="vm.login()" class="btn btn-lg btn-success btn-block" value="Ingresar"><p>&nbsp;</p><p class="text-center">No posee una cuenta? <a href="#/register" class="btn btn-xs btn-info">Regístrese</a></p></fieldset></form></div></div></div></div></div>'),e.put("app/main/main.html",'<div id="wrapper"><nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0"><header-navbar></header-navbar><acme-navbar></acme-navbar></nav><div id="page-wrapper"><div class="row"><div class="col-lg-12"><h1 class="page-header">Dashboard</h1></div></div><div ng-if="vm.deviceCount === 0" class="row"><div class="col-lg-12"><div class="col-lg-4 col-lg-offset-4"><p class="text-center text-primary">No existen dispositivos asociados a su cuenta</p><a href="#/devices/assign" class="btn btn-primary btn-lg btn-block"><i class="fa fa-plus fa-fw"></i> Agregar su primer dispositivo</a></div></div></div><div ng-if="vm.deviceCount > 0" class="row"><div class="col-lg-8"><div class="panel panel-default"><div class="panel-heading"><i class="fa fa-bar-chart-o fa-fw"></i> Consolidado Sensores</div><div class="panel-body"><div id="morris-area-chart"></div><div ng-if="vm.nodata"><span class="text-center text-warning">No hay datos para mostrar</span></div></div></div></div><div class="col-lg-4"><div class="panel panel-default"><div class="panel-heading"><i class="fa fa-bell fa-fw"></i> Notificaciones</div><div class="panel-body"><div class="list-group"></div><a href="#" class="btn btn-default btn-block">Ver Todas las Alertas</a></div></div></div></div></div></div>'),e.put("app/logout/logout.html",""),e.put("app/register/register.html",'<div class="container"><div class="row"><div class="col-md-4 col-md-offset-4"><div class="login-panel panel panel-default"><div class="panel-heading text-center"><h3 class="panel-title"><img src="assets/images/logo_IMS.png" style="width:40%"></h3></div><div class="panel-body"><form name="form" novalidate="" role="form"><fieldset><p class="bg-danger pildorita" ng-show="vm.errorMessage != \'\'">{{errorMessage}}</p><p class="text-center bg-success pildorita" ng-show="vm.showSuccess"><strong>El usuario ha sido creado con éxito</strong>, ya puede <a href="#/login" class="btn btn-xs btn-success">Ingresar aquí</a></p><div class="form-group"><input class="form-control" ng-model="vm.email" placeholder="Correo" name="email" type="email" required=""> <span class="text-danger" ng-show="form.$submitted && form.email.$error.required">El email es obligatorio</span> <span class="text-danger" ng-show="form.$submitted && form.email.$error.email">El email ingresado es inválido</span></div><div class="form-group"><input class="form-control" ng-model="vm.password" placeholder="Password" name="password" type="password" value="" required="" minlength="5"> <span class="text-danger" ng-show="form.$submitted && form.password.$error.required">El password es obligatorio</span> <span class="text-danger" ng-show="form.$submitted && form.password.$error.minlength">El password debe tener al menos 5 caracteres</span></div><div class="form-group"><input class="form-control" ng-model="vm.password2" placeholder="Repetir password" name="password2" type="password" value="" required="" match="vm.password"> <span class="text-danger" ng-show="form.$submitted && form.password2.$error.required">Debe repetir el password</span><div class="text-danger" ng-show="form.$submitted && form.password2.$error.match">Los passwords no coinciden</div></div><input type="submit" ng-click="vm.register()" class="btn btn-lg btn-success btn-block" value="Registrarme"><p>&nbsp;</p><p class="text-center">Ya posee una cuenta? <a href="#/login" class="btn btn-xs btn-info">Ingresar</a></p></fieldset></form></div></div></div></div></div>'),e.put("app/components/navbar/navbar.html",'<div class="navbar-default sidebar" role="navigation"><div class="sidebar-nav navbar-collapse"><ul class="nav" id="side-menu"><li><a href="#/dashboard"><i class="fa fa-dashboard fa-fw"></i> Dashboard</a></li><li ng-repeat="device in vm.devices track by device.id"><a ng-href="#/devices/{{device.id}}"><i class="fa fa-bar-chart-o fa-fw"></i> Sensor {{device.name}}<span class="fa arrow"></span></a></li><li><a href="#/devices/assign"><i class="fa fa-plus fa-fw"></i> Agregar Dispositivo</a></li></ul></div></div>'),
e.put("app/components/navhead/navhead.html",'<ul class="nav navbar-nav navbar-right"><li><a href="#/logout">&nbsp;Logout&nbsp;<i class="glyphicon glyphicon-log-out"></i></a></li></ul><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button> <a class="navbar-brand" href="index.html">Industrial MS</a></div>')}]);
//# sourceMappingURL=../maps/scripts/app-15e96c024b.js.map
