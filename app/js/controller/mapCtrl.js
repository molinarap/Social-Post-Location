socialApp.controller('mapCtrl', function($rootScope, $scope, $http, $log, uiGmapIsReady, $timeout, $window, instaService) {

    uiGmapIsReady.promise(1).then(function(instances) {
        instances.forEach(function(inst) {

            var map = inst.map;
            var uuid = map.uiGmap_id;
            var mapInstanceNumber = inst.instance; // Starts at 1.
        });
    });

    var localUser = $window.localStorage.currentUser;

    if (localUser) {
        localUser = JSON.parse($window.localStorage.currentUser);
    }

    $scope.options = {
        scrollwheel: false
    };

    var showPosition = function(position) {
        $scope.map = {
            center: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            zoom: 14,
            bounds: {}
        };

        $scope.marker = {
            id: 0,
            coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            options: {
                draggable: false,
                icon: '/static/images/maker.png'
            }
        };

        $scope.circles = [{
            id: 1,
            center: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            radius: 2000,
            stroke: {
                color: '#08B21F',
                weight: 2,
                opacity: 1
            },
            fill: {
                color: '#08B21F',
                opacity: 0.5
            },
            geodesic: true,
            draggable: true,
            clickable: true,
            editable: true,
            visible: true,
            control: {}
        }];

        $scope.search = {};

        var searchInput = document.getElementById('place-input');
        var searchBox = new google.maps.places.SearchBox(searchInput);

        var events = {
            places_changed: function(searchBox) {}
        }
        $scope.searchbox = { template: 'searchbox.tpl.html', events: events };

        $log.info('map', $scope.map);

    };

    var getLocation = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $scope.map = {
                center: $scope.coords,
                zoom: 10
            };
        }
    };

    getLocation();

    var createMarker = function(obj) {
        var photo = {
            user: obj.user.username,
            profile_picture: obj.user.profile_picture,
            date: obj.created_time,
            img: obj.images.low_resolution.url,
            tags: obj.tags,
            latitude: obj.location.latitude,
            longitude: obj.location.longitude,
            id: obj.location.id,
            name: obj.location.name
        };

        if (obj.caption) {
            photo.text = obj.caption.text;
        }

        return photo;
    };

    $scope.photos = [];
    $scope.showMyPhoto = function() {
        instaService.getFeed(localUser.instagramId)
            .then(function success(result) {
                var photos = result.data;
                $log.info('photos', photos);
                for (var i = 0; i < photos.length; i++) {
                    if (photos[i].location !== null) {
                        $scope.photos.push(createMarker(photos[i]));
                    }
                }
                $log.info($scope.photos);
                $rootScope.currentUser.photos = $scope.photos;
            }, function error(error) {
                console.log(error);
            });
    };

    $scope.locationPhotos = []
    $scope.showLocationPhoto = function() {
        var lat = 42.2631678;
        var lng = 14.3073269;
        var d = 5000;
        instaService.getMediaLocation(localUser.instagramId, lat, lng, d)
            .then(function success(result) {
                var photos = result.data;
                for (var i = 0; i < photos.length; i++) {
                    $scope.locationPhotos.push(createMarker(photos[i]));
                }
                $log.info($scope.locationPhotos);
            }, function error(error) {
                console.log(error);
            });
    };



});
