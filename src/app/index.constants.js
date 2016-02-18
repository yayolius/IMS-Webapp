/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('webapp')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('apiURL','http://localhost:8080');

})();
