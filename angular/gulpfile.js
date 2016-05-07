var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var minify = require('gulp-minify');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');


var paths = {
  js: 'js/*.js',
  jsdist : 'dist/js/',
  html : '*.html',
  sass : 'scss/*.scss',
  css : 'dist/css/'
};

gulp.task('default', ['watch', 'js','html','sass', 'livereload']);

gulp.task('watch', function() {
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe(gulp.dest(paths.jsdist))
    .pipe(connect.reload());
});

gulp.task('sass', function() {
  return gulp.src(paths.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.css))
    .pipe(connect.reload());
});

gulp.task('html', function () {
  return gulp.src(paths.html)
    .pipe(connect.reload());
});

gulp.task('livereload', function () {
  return connect.server({
    port: 1337,
    livereload: true
  });
});
