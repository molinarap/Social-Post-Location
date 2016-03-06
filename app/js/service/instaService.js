socialApp
    .factory('instaService', function($http) {
        return {
            getFeed: function(id) {
                return $http.post('http://localhost:3000/api/myphoto', {
                    instagram_id: id
                });
            },
            getMediaLocation: function(id, lat, lng, d) {
                return $http.post('http://localhost:3000/api/locationPhoto', {
                    instagram_id: id,
                    lat: lat,
                    lng: lng,
                    distance: d
                });
            }
        }
    });
