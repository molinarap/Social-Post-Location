socialApp.controller('mapCtrl', function($rootScope, $scope, $http, $log, NgMap, $timeout, $window, instaService, searchService) {

    // check if there is a user logged
    var localUser = $window.localStorage.currentUser;
    if (localUser) {
        localUser = JSON.parse($window.localStorage.currentUser);
    }

    // get position by "navigator.geolocation"
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

    // init ng-maps
    NgMap.getMap().then(function(map) {
        console.log('map', map);
        $scope.map = map;
        $scope.coords1 = {};
        $scope.place = {};
        getLocation();
    });

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

    // autocomplete google maps
    $scope.placeChanged = function(more) {
        $scope.place = this.getPlace();
        $scope.coords1.latitude = $scope.place.geometry.location.lat();
        $scope.coords1.longitude = $scope.place.geometry.location.lng();
        $scope.loader = true;

        var lat, lng;
        var p = $scope.page;
        var d = parseInt($scope.distance);

        if (!$scope.coords1) {
            lat = $scope.coords.latitude;
            lng = $scope.coords.longitude;
        } else {
            lat = $scope.coords1.latitude;
            lng = $scope.coords1.longitude;
        }

        if (more) {
            lat = lat + (Math.random() / 100);
            lng = lng + (Math.random() / 100);
            console.log("new coords:" + lat + ", " + lng);
        } else {
            $scope.locationPhotos = [];
            $scope.map.setCenter($scope.c);
        }

        $scope.c = { "lat": lat, "lng": lng };


        searchService.searchPhoto(lat, lng, p, d)
            .then(function success(result) {
                p = $scope.page = $scope.page + 1;
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


    // torna un array di file in /storage/html/[data]/[nome]/
    // var placeChanged = new Promise(function(resolve, reject) {
    //     $scope.place = this.getPlace();
    //     $scope.coords1.latitude = $scope.place.geometry.location.lat();
    //     $scope.coords1.longitude = $scope.place.geometry.location.lng();
    //     resolve($scope.coords1);
    // });

    // $scope.all = function(argument) {
    //     placeChanged()
    //         .then(function(result) {
    //             searchPhotos(result, false);
    //         });
    // };


    $scope.locationPhotos = [];
    $scope.loader = false;
    $scope.page = 0;
    $scope.distance = "5";

    var contains = function(objId, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].id === objId) {
                return true;
            }
        }
        return false;
    };

    $scope.searchPhotos = function(coords1, more) {
        $scope.loader = true;

        var lat, lng;
        var p = $scope.page;
        var d = parseInt($scope.distance);

        if (!coords1) {
            lat = $scope.coords.latitude;
            lng = $scope.coords.longitude;
        } else {
            lat = coords1.latitude;
            lng = coords1.longitude;
        }

        if (more) {
            lat = lat + (Math.random() / 10);
            lng = lng + (Math.random() / 10);
            console.log("new coords:" + lat + ", " + lng);
        } else {
            $scope.locationPhotos = [];
            $scope.map.setCenter($scope.c);
        }

        $scope.c = { "lat": lat, "lng": lng };


        searchService.searchPhoto(lat, lng, p, d)
            .then(function success(result) {
                p = $scope.page = $scope.page + 1;
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
});
