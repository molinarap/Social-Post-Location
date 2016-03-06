socialAdmin
    .factory('dbService', function($http) {
        return {
            getLocationPhoto: function(lat, lng, d) {
                return $http.post('http://localhost:3000/api/queryPhoto', {
                    lat: lat,
                    lng: lng,
                    distance: d
                });
            }
        }
    });
