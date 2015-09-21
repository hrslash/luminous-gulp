'use strict';

var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');

/**
 * Report file paths in the stream pipeline.
 *
 * @param {string} task
 * @param {array} src
 * @param {string} dist
 * @return {function}
 */
var report = function (task, src, dist) {
  var cwd = process.cwd(), paths = [];

  return through.obj(function (file, enc, cb) {
    paths.push(path.relative(cwd, file.path));
    this.push(file);
    cb();
  }, function (cb) {
    report.log(task, src, dist, paths);
    cb();
  });
};

/**
 * Report file paths.
 *
 * @param {string} task
 * @param {array} src
 * @param {string} dist
 * @param {array} paths
 * @return {undefined}
 */
report.log = function (task, src, dist, paths) {
  var lines = ['luminous-gulp: ' + gutil.colors.cyan(task)];

  src.forEach(function (s) { lines.push(gutil.colors.yellow('# ' + ['./' + s, './' + dist].join(' > '))); });
  paths.forEach(function (p) { lines.push(gutil.colors.gray('- ./' + p)); });
  lines.push(gutil.colors.gray('(Found ' + paths.length + ' files)'))

  gutil.log(lines.join(gutil.linefeed));
};

module.exports = report;
