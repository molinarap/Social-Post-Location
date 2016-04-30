socialApp
    .factory('db2Service', function($http) {
        return {
            getLocationPhoto: function(lat, lng, d) {
                return $http.post('http://localhost:3000/api/queryPhoto', {
                    lat: lat,
                    lng: lng,
                    distance: d
                });
            },
            savePhoto: function(photo) {
                return $http.post('http://localhost:3000/api/savePhoto', { photo });
            },
            retrievePhoto: function(lat, lng) {
                return $http.post('http://localhost:3000/api/retrievePhoto', { lat: lat, lng: lng });
            }
        };
    });
