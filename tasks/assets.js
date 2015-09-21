'use strict';

var path = require('path');
var gulp = require('gulp');
var del = require('del');
var _ = require('lodash');
var gulpFilter = require('gulp-filter');
var runSequence = require('run-sequence');
var RevAll = require('gulp-rev-all');
var gzip = require('gulp-gzip');

var build = function (lg) {
  var config = lg.config('assets');

  return function () {
    var revAll = new RevAll(_.assign({}, config.revAllOptions, {
      prefix: config.url.replace(/\/$/, '') + '/'
    }));

    del.sync(path.join(config.publicPath, '/**/*'));

    return gulp.src(path.join(config.tmpPath, '/**/*'))
      .pipe(lg.plumber())
      .pipe(revAll.revision())
      .pipe(gulp.dest(config.publicPath))
      // gzip
      .pipe(gulpFilter('**/*.{css,js,svg}'))
      .pipe(gzip(config.gzipOptions))
      .pipe(gulp.dest(config.publicPath))
      // save manifest
      .pipe(revAll.manifestFile())
      .pipe(gulp.dest(config.publicPath))
      // notify & reload
      .pipe(lg.notify("Build Assets Finished"))
      .on('end', lg.reload);
  };
};

module.exports = function (lg) {
  var config = lg.config('assets'),
      types = ['assets-copy', 'assets-css', 'assets-img', 'assets-js'];

  // main task
  lg.task('assets', ['assets:clean'], function (cb) {
    var prepareTasks = types.map(function (type) { return lg(type + ':prepare'); });
    runSequence(prepareTasks, lg('assets:build'), cb);
  });

  // watch task
  lg.task('assets:watch', ['assets'], function (cb) {
    var watchTasks = types.map(function (type) { return lg(type + ':watch'); });
    runSequence(watchTasks, cb);
  });

  // build task
  lg.task('assets:build', build(lg));

  // clean task
  lg.task('assets:clean', function () {
    return Promise.all([
      del(path.join(config.publicPath, '/**/*')),
      del(path.join(config.tmpPath, '/**/*'))
    ]);
  });
};

module.exports.build = build;
