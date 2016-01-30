socialApp
    .config(function($authProvider) {
        $authProvider.oauth2({
            name: 'instagram',
            url: 'http://localhost:3000/auth/instagram',
            redirectUri: 'http://socialpost.westeurope.cloudapp.azure.com/thanks',
            clientId: '7c83df2dd8004cb683d5a861065507fd',
            requiredUrlParams: ['scope'],
            scope: ['likes'],
            scopeDelimiter: '+',
            authorizationEndpoint: 'https://api.instagram.com/oauth/authorize'
        });
    });

