socialApp
    .config(function($authProvider) {

        var url = window.location.hostname;
        console.log(url);

        $authProvider.oauth2({
            name: 'instagram',
            url: 'http://'+url+':3000/users/auth/instagram',
            redirectUri: 'http://'+url+':3000/thanks',
            clientId: '7c83df2dd8004cb683d5a861065507fd',
            requiredUrlParams: ['scope'],
            scope: ['basic', 'comments', 'follower_list', 'likes', 'public_content', 'relationships'],
            scopeDelimiter: '+',
            authorizationEndpoint: 'https://api.instagram.com/oauth/authorize'
        });
    });
