'use strict';

var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');

var config = require('./config');
var loaded = [];

var ns = function (name) {
  return ['luminous', name].join(':');
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

module.exports = LuminousGulp;
