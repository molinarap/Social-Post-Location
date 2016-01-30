socialApp
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            v: '3.20',
            libraries: 'weather,geometry,visualization,places'
        });
    });
