socialApp.controller('mapCtrl', function($rootScope, $scope, $http, $log, NgMap, $timeout, $window, instaService, searchService) {

    NgMap.getMap().then(function(map) {
        console.log('map', map);
        $scope.map = map;
        $scope.coords1 = {};
        $scope.place = {};
        getLocation();
    });

    $scope.loader = false;

    var showPosition = function(position) {
        $scope.coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        console.log($scope.coords);
    };

    var getLocation = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.coords = {
                latitude: 41.902954,
                longitude: 12.453349
            };
        }
    };

    var localUser = $window.localStorage.currentUser;

    if (localUser) {
        localUser = JSON.parse($window.localStorage.currentUser);
    }

    // $scope.types = "['address']";
    $scope.placeChanged = function() {
        $scope.place = this.getPlace();
        $scope.coords1.latitude = $scope.place.geometry.location.lat();
        $scope.coords1.longitude = $scope.place.geometry.location.lng();
        console.log('coords1', $scope.coords1);
        $scope.map.setCenter($scope.place.geometry.location);

    };

    $scope.showDetail = function(e, photo) {
        $scope.photo = photo;
        $scope.map.showInfoWindow('photo-info', photo.id);
    };

    $scope.getRadius = function(num) {
        return num * 3.14;
    };

    /*$scope.locationPhotos = [];

    $scope.showLocationPhoto = function() {
        $scope.locationPhotos = [];

        // VATICANO
        //var lat = $scope.lat = 41.902954;
        //var lng = $scope.lng = 12.453349;

        // PAESTUM
        var lat = $scope.lat = 40.419994;
        var lng = $scope.lng = 15.005522;

        var d = 5000;
        searchService.getLocationPhoto(lat, lng, d)
            .then(function success(result) {
                var photos = $scope.locationPhotos = result.data;
                for (var i = 0; i < photos.length; i++) {
                    searchService.savePhoto(photos[i])
                        .then(function success(result) {
                            console.log('foto salvata: ', result);
                        }, function error(error) {
                            console.log('errore nel salvataggio: ', error);
                        });
                }
                $log.info('$scope.locationPhotos', $scope.locationPhotos);
            }, function error(error) {
                console.log(error);
            });
    };

    $scope.locationRetrievePhoto = [];

    $scope.showRetrievePhoto = function() {
        $scope.locationRetrievePhoto = [];

        var lat = $scope.lat = 40.419994;
        var lng = $scope.lng = 15.005522;

        searchService.retrievePhoto(lat, lng)
            .then(function success(result) {
                var photos = result.data;
                for (var i = 0; i < photos.length; i++) {
                    photos[i].location.latitude = parseFloat(photos[i].location.latitude);
                    photos[i].location.latitude = photos[i].location.latitude + (Math.random() / 1000);
                    photos[i].location.longitude = parseFloat(photos[i].location.longitude);
                    photos[i].location.longitude = photos[i].location.longitude + (Math.random() / 1000);
                    $scope.locationRetrievePhoto.push(photos[i]);
                }
                $log.info('$scope.locationRetrievePhoto', $scope.locationRetrievePhoto);
            }, function error(error) {
                $log.info('showRetrievePhotoError', error);
            });
    };*/
    $scope.locationPhotos2 = [];

    $scope.showPhotos = function(coords1, reset) {

        $scope.loader = true;

        var lat, lng;

        if (!coords1) {
            lat = $scope.coords.latitude;
            lng = $scope.coords.longitude;
        } else {
            lat = coords1.latitude;
            lng = coords1.longitude;
        }

        searchService.showPhoto(lat, lng)
            .then(function success(result) {
                var photos = result.data;
                if (reset) {
                    $scope.locationPhotos2 = [];
                }
                for (var i = 0; i < photos.length; i++) {
                    photos[i].location.latitude = parseFloat(photos[i].location.latitude);
                    photos[i].location.latitude = photos[i].location.latitude + (Math.random() / 1000);
                    photos[i].location.longitude = parseFloat(photos[i].location.longitude);
                    photos[i].location.longitude = photos[i].location.longitude + (Math.random() / 1000);
                        $scope.locationPhotos2.push(photos[i]);
                }
                $log.info('$scope.locationPhotos', $scope.locationPhotos);
                $scope.loader = false;
            }, function error(error) {
                $log.info('showRetrievePhotoError', error);
                $scope.loader = false;

            });

    };

    //$scope.showPhotos();
});
