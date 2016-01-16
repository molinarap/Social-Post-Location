var gulp = require('gulp'),
    server = require('gulp-develop-server');

gulp.task('server:start', function() {
    server.listen({
        path: './app.js'
    });
});

gulp.task('scripts', function() {
    return gulp.src('./node_modules/*')
        .pipe(gulp.dest('./app/lib'));
});

// restart server if app.js changed 
gulp.task('server:restart', function() {
    gulp.watch(['./app.js'], server.restart);
});

gulp.task('default', ['server:start', 'server:restart', 'scripts']);
