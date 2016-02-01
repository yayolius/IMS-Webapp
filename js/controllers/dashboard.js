imsControllers.controller('DashboardController', ['$scope', '$http', function($scope) {
  console.log('DashboardController');

  if (typeof fakeChart === 'function') {
    fakeChart();
  } else {
    console.log('No dashboard chart.');
  }
}]);

