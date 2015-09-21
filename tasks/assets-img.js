'use strict';

var gulp = require('gulp');
var del = require('del');
var imagemin = require('gulp-imagemin');
var buildAssets = require('./assets').build;

module.exports = function (lg) {
  var config = lg.config('assets.img');

  // main task
  lg.task('assets-img', ['assets-img:prepare'], buildAssets(lg));

  // watch task
  lg.task('assets-img:watch', function () {
    gulp.watch(config.watches, [lg('assets-img')]);
  });

  // prepare task
  lg.task('assets-img:prepare', function () {
    del.sync(config.tmpPath);

    return gulp.src(config.src)
      .pipe(lg.report('assets-img:prepare', config.src, config.tmpPath))
      .pipe(lg.plumber())
      .pipe(imagemin(config.imageminOptions))
      .pipe(gulp.dest(config.tmpPath));
  });
};
