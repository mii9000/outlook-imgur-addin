var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin")
    del = require("del"),
    webserver = require("gulp-webserver"),
    uglify = require('gulp-uglify'),
    runSequence = require("run-sequence"),
    modules = "node_modules/",
    dist = "dist/",
    src = "src/",
    js = src + "**/*.js",
    css = src + "**/*.css",
    image = src + "images/**/*.*",
    html = src + "*.html";

gulp.task('clean', function (){
    return del(['dist']);
});

gulp.task('css', function(){
    return gulp.src([
        modules + "bootstrap/dist/css/bootstrap.css",
        css
    ])
    .pipe(concat("all.css"))
    .pipe(cssmin())
    .pipe(gulp.dest(dist));  
});

gulp.task('js', function(){
    return gulp.src([
        modules + "jquery/dist/jquery.js",
        modules + "bootstrap/dist/js/bootstrap.js",
        js
    ])
    .pipe(uglify())
    .pipe(concat("app.js"))
    .pipe(gulp.dest(dist));
});

gulp.task('image', function(){
    return gulp.src([
        image
    ])
    .pipe(gulp.dest(dist + "images"));
});

gulp.task('html', function(){
    return gulp.src([
        html
    ])
    .pipe(gulp.dest(dist));
});

gulp.task('manifest', function(){
    return gulp.src([
        "./manifest.xml"
    ])
    .pipe(gulp.dest(dist));
});

gulp.task('server', function () {
    return gulp.src('./dist')
    .pipe(webserver({
        livereload: {
            enable: true,
            filter: function(fileName) {
                if (fileName.match(/.map$/)) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        https: true,
        port: '8443',
        host: 'localhost',
        directoryListing: false
    }));
});

gulp.task('build', function() {
    return runSequence('clean', 'html', 'css', 'js', 'image', 'manifest');
});

gulp.task('watch', function() {
  gulp.watch(js, ['js']);
  gulp.watch(css, ['css']);
  gulp.watch(image, ['image']);
  gulp.watch(html, ['html']);
});

gulp.task('default', ['watch', 'build']);
