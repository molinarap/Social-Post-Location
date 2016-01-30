socialApp.controller('instaCtrl', function($scope, $http, $log, $window, $rootScope, $auth) {

    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    var linkInstagram = function() {
        $auth.link('instagram')
            .then(function(response) {
                $window.localStorage.currentUser = JSON.stringify(response.data.user);
                $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
            });
    };

    linkInstagram();

});
