socialApp.controller('mapCtrl', function($scope, $http, $log, uiGmapIsReady, $timeout) {

    uiGmapIsReady.promise(1).then(function(instances) {
        instances.forEach(function(inst) {

            var map = inst.map;
            var uuid = map.uiGmap_id;
            var mapInstanceNumber = inst.instance; // Starts at 1.
        });
    });

    $scope.options = {
        scrollwheel: false
    };

    var showPosition = function(position) {
        $scope.map = {
            center: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            zoom: 14
        };

        /*$scope.marker = {
            id: 0,
            coords: $scope.map.center,
            options: {
                draggable: true,
                icon:'/static/images/maker.png'
            }
        };*/
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

        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);

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

    $scope.options = {
        scrollwheel: false
    };

    /*$scope.coordsUpdates = 0;
    $scope.dynamicMoveCtr = 0;

    $scope.$watchCollection("marker.coords", function(newVal, oldVal) {
        if (_.isEqual(newVal, oldVal))
            return;
        $scope.coordsUpdates++;
    });
    $timeout(function() {
        $scope.marker.coords = {
            latitude: 42.1451,
            longitude: -100.6680
        };
        $scope.dynamicMoveCtr++;
        $timeout(function() {
            $scope.marker.coords = {
                latitude: 43.1451,
                longitude: -102.6680
            };
            $scope.dynamicMoveCtr++;
        }, 2000);
    }, 1000);*/

});
