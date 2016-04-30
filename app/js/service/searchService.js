socialApp
    .factory('searchService', function($http) {
        return {
            showPhoto: function(lat, lng) {
                return $http.post('http://localhost:3000/api/download-show-photos', { lat: lat, lng: lng });
            }
        };
    });
