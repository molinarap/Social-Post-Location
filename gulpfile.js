var gulp = require('gulp'),
    server = require('gulp-develop-server');

// start serve
gulp.task('server:start', function() {
    server.listen({
        path: './app.js'
    });
});

// create frontend dir by node_modules
gulp.task('scripts', function() {
    return gulp.src('./node_modules/*/**')
        .pipe(gulp.dest('./app/lib'));
});

// restart server if app.js changed 
gulp.task('server:restart', function() {
    gulp.watch(['./app.js'], server.restart);
    gulp.watch(['./app/**/**/*'], server.restart);
    gulp.watch(['./routes/*'], server.restart);
});


//gulp.task('default', ['server:start', 'server:restart', 'scripts']);
gulp.task('default', ['server:start', 'server:restart']);
