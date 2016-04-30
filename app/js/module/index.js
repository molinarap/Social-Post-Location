var socialApp = angular.module('SocialApp', [
    'ngMaterial',
    'satellizer',
    'ngMap'
]);

socialApp.config(function($mdIconProvider) {
    $mdIconProvider.iconSet("avatars", 'icons/avatar-icons.svg', 128);
});
