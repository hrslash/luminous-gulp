'use strict';

var gulp = require('gulp');
var del = require('del');
var _ = require('lodash');
var eventStream = require('event-stream');
var handleError = require('../handle-error');
var buildAssets = require('./assets').build;

module.exports = function (lg) {
  var targets = _.values(lg.config('assets.copy'));

  var copy = function (target) {
    del.sync(target.tmpPath);

    return gulp.src(target.src)
      .pipe(handleError())
      .pipe(gulp.dest(target.tmpPath));
  };

  // main task
  lg.task('assets-copy', ['assets-copy:prepare'], buildAssets(lg));

  // watch task
  lg.task('assets-copy:watch', function () {
    targets.forEach(function (target) {
      if (target.watch) {
        gulp.watch(target.watches, function () {
          copy(target).on('end', buildAssets(lg));
        });
      }
    });
  });

  // prepare task
  lg.task('assets-copy:prepare', function (cb) {
    var tasks = targets.map(copy);
    eventStream.merge(tasks).on('end', cb);
  });
};
