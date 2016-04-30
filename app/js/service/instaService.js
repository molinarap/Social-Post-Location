socialApp
    .factory('instaService', function($http) {
        return {
            getFeed: function(id) {
                return $http.post('http://localhost:3000/users/myphoto', {
                    instagram_id: id
                });
            },
            getMediaLocation: function(id, lat, lng, d) {
                return $http.post('http://localhost:3000/users/locationPhoto', {
                    instagram_id: id,
                    lat: lat,
                    lng: lng,
                    distance: d
                });
            }
        }
    });
