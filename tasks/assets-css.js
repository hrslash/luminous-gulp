'use strict';

var gulp = require('gulp');
var del = require('del');
var gulpIf = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-sass');
var less = require('gulp-less');
var buildAssets = require('./assets').build;

module.exports = function (lg) {
  var config = lg.config('assets.css');

  // main task
  lg.task('assets-css', ['assets-css:prepare'], buildAssets(lg));

  // watch task
  lg.task('assets-css:watch', function () {
    gulp.watch(config.watches, [lg('assets-css')]);
  });

  // prepare task
  lg.task('assets-css:prepare', function () {
    del.sync(config.tmpPath);

    return gulp.src(config.src)
      .pipe(lg.report('assets-css:prepare', config.src, config.tmpPath))
      .pipe(lg.plumber())
      .pipe(sourcemaps.init())
      .pipe(gulpIf(/\.scss$/i, sass(config.sassOptions)))
      .pipe(gulpIf(/\.less$/i, less(config.lessOptions)))
      .pipe(autoprefixer(config.autoprefixerOptions))
      .pipe(minifyCss(config.minifyCssOptions))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.tmpPath));
  });
};
