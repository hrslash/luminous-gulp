'use strict';

var gulp = require('gulp');
var path = require('path');
var del = require('del');
var gulpFilter = require('gulp-filter');
var RevAll = require('gulp-rev-all');
var gzip = require('gulp-gzip');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
var handleError = require('../handle-error');

var build = function (lg) {
  var config = lg.config('assets');

  return function () {
    var revAll = new RevAll(config.revAllOptions);

    del.sync(path.join(config.publicPath, '/**/*'));

    return gulp.src(path.join(config.tmpPath, '/**/*'))
      .pipe(handleError())
      .pipe(revAll.revision())
      .pipe(gulp.dest(config.publicPath))
      // gzip
      .pipe(gulpFilter('**/*.{css,js}'))
      .pipe(gzip(config.gzipOptions))
      .pipe(gulp.dest(config.publicPath))
      // save manifest
      .pipe(revAll.manifestFile())
      .pipe(gulp.dest(config.publicPath))
      // notify & reload
      .pipe(notify({ message: "Build Assets Successful" }))
      .on('end', function () { livereload.reload('/'); });
  };
};

module.exports = function (lg) {
  var config = lg.config('assets'),
      types = ['assets-copy', 'assets-css', 'assets-img', 'assets-js'];

  // main task
  lg.task('assets', types.map(function (type) { return type + ':prepare'; }), build(lg));

  // watch task
  lg.task('assets:watch', types.map(function (type) { return type + ':watch'; }));

  // clean task
  lg.task('assets:clean', function (cb) {
    del.sync(path.join(config.publicPath, '/**/*'));
    del.sync(path.join(config.tmpPath, '/**/*'));
    cb();
  });
};

module.exports.build = build;
