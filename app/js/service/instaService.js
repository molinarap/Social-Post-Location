socialApp
    .factory('instaService', function($http) {
        return {
            getFeed: function(id) {
                return $http.post('http://localhost:3000/api/myphoto', {
                    instagram_id: id
                });
            }
        }
    });
