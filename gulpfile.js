var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var minify = require('gulp-minify');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');


var paths = {
  less: 'lib/less/*.less',
  css: 'public/css',
  js: 'lib/js/*.js',
  jsmin: 'public/js',
  jade : 'lib/jade/*.jade',
  html : 'public'
};

gulp.task('default', ['watch', 'less','compress','templates', 'connect']);

gulp.task('watch', function() {
    gulp.watch(paths.less, ['less']);
    gulp.watch(paths.js, ['compress']);
    gulp.watch(paths.jade, ['templates']);
});

gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe(less({
      paths: [paths.less]
    }))
    .pipe(autoprefixer({
      browsers: ['> 5%', 'IE 9']
    }))
    .pipe(gulp.dest(paths.css))
    .pipe(connect.reload());
});

gulp.task('compress', function() {
  return gulp.src(paths.js)
    .pipe(minify({
        ext:{
            min:'.min.js'
        },
        noSource : true,
        ignoreFiles: ['-min.js']
    }))
    .pipe(gulp.dest(paths.jsmin))
    .pipe(connect.reload());
});

gulp.task('templates', function() {
  var src = {
    cssSrc : 'css/style.css',
    jsSrc : 'js/script.min.js'
  };

  return gulp.src(paths.jade)
    .pipe(jade({
      locals: src
    }))
    .pipe(gulp.dest(paths.html))
    .pipe(connect.reload());
});

gulp.task('connect', function() {
  return connect.server({
    port: 1337,
    livereload: true,
    root: './public'
  });
});
