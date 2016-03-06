var socialApp = angular.module('SocialApp', [
    'ngMaterial',
    'uiGmapgoogle-maps',
    'satellizer'
]);

socialApp.config(function($mdIconProvider) {
    $mdIconProvider.iconSet("avatars", 'icons/avatar-icons.svg', 128);
});
