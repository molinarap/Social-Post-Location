socialApp.controller('instaCtrl', function($scope, $http, $log, $window, $rootScope, $auth, instaService) {

    var localUser = $window.localStorage.currentUser;

    if (localUser) {
        localUser = JSON.parse($window.localStorage.currentUser);
        $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
        console.log('localUser', localUser);
    }

    $scope.isAuthenticated = function() {
        $log.info($auth.isAuthenticated());
        return $auth.isAuthenticated();
    };

    $scope.linkInstagram = function() {
        $auth.link('instagram')
            .then(function(response) {
                console.log(response);
                $window.localStorage.currentUser = JSON.stringify(response.data.user);
                $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
            });
    };

    $scope.logout = function() {
        localStorage.removeItem('currentUser');
        location.reload();
    };


    $scope.showMyPhoto = function() {
        instaService.getFeed(localUser.instagramId)
            .then(function success(result) {
                var photos = result.data;
                $scope.photos = [];
                for (var i = 0; i < photos.length - 1; i++) {
                    if (photos[i].location !== null) {
                        $scope.photos.push(photos[i]);
                    }
                }
                $rootScope.currentUser.photos = $scope.photos;
            }, function error(error) {
                console.log(error);
            });
    };

    /*if ($auth.isAuthenticated() && ($rootScope.currentUser && $rootScope.currentUser.username)) {
        instaService.getFeed().success(function(data) {
            $scope.photos = data;
        });
    }*/

    //linkInstagram();

});
