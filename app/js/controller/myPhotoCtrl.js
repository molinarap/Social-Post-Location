socialApp.controller('myPhotoCtrl', function($rootScope, $scope, $http, $log, NgMap, $timeout, $window, instaService, searchService) {

    // check if there is a user logged
    var localUser = $window.localStorage.currentUser;
    if (localUser) {
        localUser = JSON.parse($window.localStorage.currentUser);
    }
    // autocomplete google maps
    var downloadPhoto = function(coords) {
        var lat = coords.lat;
        var lng = coords.lng;
        var pg = $scope.page = $scope.page + 1;
        var d = parseInt($scope.distance);
        var at = localUser.accessToken;

        instaService.getFeed()
            .then(function success(result) {
                console.log(pg);
                var photos = result.data;
                for (var i = 0; i < photos.length; i++) {
                    // var new_latitude = parseFloat(photos[i].location.latitude);
                    // photos[i].location.latitude = new_latitude + (Math.random() / 1000);
                    // var new_longitude = parseFloat(photos[i].location.longitude);
                    // photos[i].location.longitude = new_longitude + (Math.random() / 1000);
                    if (!contains(photos[i].id, $scope.locationPhotos)) {
                        console.log("foto nuova");
                        $scope.locationPhotos.push(photos[i]);
                    } else {
                        console.log("foto già presente");
                    }
                }

                $log.info('$scope.locationPhotos', $scope.locationPhotos);
                $scope.loader = false;
                $scope.showSearch = false;

            }, function error(error) {
                $log.info('showRetrievePhotoError', error);
                $scope.loader = false;
                $scope.showSearch = false;
            });
    };


});
