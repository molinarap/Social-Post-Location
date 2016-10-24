socialApp.controller('mapCtrl', function($rootScope, $scope, $http, $log, NgMap, $timeout, $window, instaService, searchService) {

    // check if there is a user logged
    var localUser = $window.localStorage.currentUser;
    if (localUser) {
        localUser = JSON.parse($window.localStorage.currentUser);
    }

    var contains = function(objId, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].id === objId) {
                return true;
            }
        }
        return false;
    };

    $scope.locationPhotos = [];

    $scope.showDetail = function(e, photo) {
        $scope.photo = photo;
        $scope.map.showInfoWindow('photo-info', photo.id);
    };

    $scope.getRadius = function(num) {
        return num * parseInt($scope.distance);
    };

    $scope.showSearch = true;
    $scope.changeIcon = function() {
        if ($scope.locationPhotos.length) {
            $scope.showSearch = !$scope.showSearch;
        }
    };

    var getLocation = function() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition()
                    .then(function(position) {
                        $scope.coords = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        resolve($scope.coords);
                    });
            } else {
                $scope.coords = {
                    lat: 41.902954,
                    lng: 12.453349
                };
            }
        });
    };

    $scope.loader = false;
    $scope.distance = "1";


    // init ng-maps
    NgMap.getMap().then(function(map) {
        // console.log('map', map);
        $scope.map = map;
        $scope.coords = {};
        $scope.place = {};
        return getLocation();
    }).then(function(result) {
        console.log(result);
    });

    var retriveInfoPlace = function(infoMaps, more) {
        return new Promise((resolve, reject) => {
            console.log(infoMaps);
            if (more) {
                resolve(false);
            } else {
                resolve(infoMaps.getPlace());
            }
        });
    };

    var centerMap = function(place) {
        return new Promise((resolve, reject) => {
            $scope.place = place;
            if (place === false) {
                $scope.coords.lat = $scope.coords.lat + (Math.random() / 100);
                $scope.coords.lng = $scope.coords.lng + (Math.random() / 100);
            } else {
                $scope.page = -1;
                $scope.coords = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                console.log('$scope.coords', $scope.coords);
                $scope.locationPhotos = [];
                $scope.map.setCenter($scope.coords);
            }
            resolve($scope.coords);
        });
    };

    // autocomplete google maps
    var downloadPhoto = function(coords) {
        var lat = coords.lat;
        var lng = coords.lng;
        var pg = $scope.page = $scope.page + 1;
        var d = parseInt($scope.distance);
        var at = localUser.accessToken;

        searchService.searchPhoto(lat, lng, pg, d, at)
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

    $scope.pointPlace = function(more) {
        $scope.loader = true;
        var infoMaps = this;
        var m = more;
        retriveInfoPlace(infoMaps, m)
            .then(function(place) {
                return centerMap(place);
            }).then(function(coords) {
                downloadPhoto(coords);
            });
    };

});
