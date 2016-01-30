socialApp.controller('searchCtrl', function($scope, $http, $log, uiGmapIsReady) {

    $scope.search = {
        social: 'photo',
    };

    $scope.title1 = 'Button';
    $scope.title4 = 'Warn';
    $scope.isDisabled = true;
    $scope.googleUrl = 'http://google.com';
});
