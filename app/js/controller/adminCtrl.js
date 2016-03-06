socialAdmin.controller('adminCtrl', function($rootScope, $scope, $http, $log, $timeout, $window, dbService) {

    /*$scope.photos = [];
    $scope.showMyPhoto = function() {
        dbService.getFeed(localUser.instagramId)
            .then(function success(result) {
                var photos = result.data;
                $log.info('photos', photos);
                for (var i = 0; i < photos.length; i++) {
                    $scope.photos.push(photos[i]);
                }
                $log.info($scope.photos);
                $rootScope.currentUser.photos = $scope.photos;
            }, function error(error) {
                console.log(error);
            });
    };*/

    $scope.locationPhotos = []
    $scope.showLocationPhoto = function() {
        //var r = (Math.random() * 100) + 1;
        var lat = 42.2631678;
        var lng = 14.3073269;
        var d = 5000;
        dbService.getLocationPhoto(lat, lng, d)
            .then(function success(result) {
                var photos = result.data;
                for (var i = 0; i < photos.length; i++) {
                    console.log(photos[i]);

                    $scope.locationPhotos.push(photos[i]);
                }
                $log.info($scope.locationPhotos);
            }, function error(error) {
                console.log(error);
            });
    };



});
