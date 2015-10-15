'use strict';

var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var _ = require('lodash');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');

var config = require('./config');
var loaded = [];

var ns = function (name) {
  return ['luminous-gulp', name].join(':');
};

/**
 * Get the task name with the namespace after loading.
 *
 * @param {string} name
 * @return {string}
 */
var LuminousGulp = function (name) {
  var file = name.split(':')[0];

  if (!_.includes(loaded, file)) {
    loaded.push(file);
    require(path.join(__dirname, 'tasks', file))(LuminousGulp);
  }

  return ns(name);
};

/**
 * Get configuration.
 *
 * @param {string} path
 * @return {Object}
 */
LuminousGulp.config = function (path) {
  var paths = _.isString(path) ? path.split('.') : _.toArray(arguments),
      value = config;

  while (paths.length > 0) {
    value = value[paths.shift()];
  }

  return value;
};

/**
 * The wrapper for "gulp.task()".
 *
 * @param {string} name
 * @param {array} deps
 * @param {function} fn
 * @return {undefined}
 */
LuminousGulp.task = function (name, deps, fn) {
  if (!fn && typeof deps === 'function') {
    fn = deps;
    deps = [];
  }
  gulp.task(ns(name), deps.map(LuminousGulp), fn);
};

// Report file paths in the stream pipeline.
LuminousGulp.report = require('./report');

// https://www.npmjs.com/package/gulp-notify
LuminousGulp.notify = function (message) {
  return notify({title: 'luminous-gulp', message: message});
};
LuminousGulp.onError = function () {
  return notify.onError({title: 'luminous-gulp', message: "Error: <%= error.message %>"});
};

// https://www.npmjs.com/package/gulp-plumber
LuminousGulp.plumber = function () {
  return plumber({ errorHandler: LuminousGulp.onError() });
};

// https://www.npmjs.com/package/gulp-livereload
LuminousGulp.listen = function (options) {
  livereload.listen(options);
};
LuminousGulp.reload = function (file) {
  if (file && file.path) {
    gutil.log(gutil.colors.magenta('./' + path.relative(process.cwd(), file.path)) + ' is changed.');
  }
  livereload.reload('/');
};

module.exports = LuminousGulp;
