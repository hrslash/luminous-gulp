'use strict';

var gulp = require('gulp');
var path = require('path');
var del = require('del');
var _ = require('lodash');
var globby = require('globby');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var eventStream = require('event-stream');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var handleError = require('../handle-error');
var buildAssets = require('./assets').build;

module.exports = function (lg) {
  var config = lg.config('assets.js');

  // main task
  lg.task('assets-js', ['assets-js:prepare'], buildAssets(lg));

  // watch task
  lg.task('assets-js:watch', function () {
    gulp.watch(config.watches, [lg('assets-js')]);
  });

  // prepare task
  lg.task('assets-js:prepare', function (cb) {
    del.sync(config.tmpPath);

    globby(config.src).then(function (files) {
      var tasks = files.map(function (entry) {
        var opts = _.assign({}, config.browserifyOptions, {
          entries: [entry],
          debug: true // to create sourcemaps
        });

        return browserify(opts)
          .bundle().on('error', notify.onError("Error: <%= error.message %>"))
          .pipe(source(path.relative(config.srcPath, entry)))
          .pipe(handleError())
          .pipe(rename({extname: '.js'}))
          .pipe(buffer())
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(uglify(config.uglifyOptions))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest(config.tmpPath));
      });

      eventStream.merge(tasks).on('end', cb);
    });
  });
};
