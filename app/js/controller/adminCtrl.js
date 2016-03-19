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

    $scope.search = {};

    $scope.locationPhotos = []
    $scope.showLocationPhoto = function() {
        //var r = (Math.random() * 100) + 1;
        var coords = [{
            "location": "Chieti",
            "lat": 41.854333,
            "lng": 12.468105
        }];

        //var lat = $scope.search.latitude;
        //var lng = $scope.search.longitude;
        //var lat = 42.2631678;
        //var lng = 14.3073269;
        var d = 5000;
        for (var j = 0; j < coords.length; j++) {
            dbService.getLocationPhoto(coords[j].lat, coords[j].lng, d)
                .then(function success(result) {
                    var photos = result.data;
                    for (var i = 0; i < photos.length; i++) {
                        $scope.locationPhotos.push(photos[i]);
                        dbService.savePhoto(photos[i])
                            .then(function success(result) {
                                console.log('foto salvata: ', result);
                            }, function error(error) {
                                console.log('errore nel salvataggio: ', error);
                            });
                    }
                    $log.info($scope.locationPhotos);
                }, function error(error) {
                    console.log(error);
                });
        }

    };



});