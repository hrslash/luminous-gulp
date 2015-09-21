'use strict';

var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
var tildify = require('tildify');
var _ = require('lodash');

var config = {};

// -----------------------------------------------------------------------------
// assets
// -----------------------------------------------------------------------------

config.assets = {
  url: '/assets',
  publicPath: './assets',
  srcPath: './resources/assets',
  tmpPath: './storage/framework/assets',

  // https://www.npmjs.com/package/gulp-rev-all
  revAllOptions: {
  },

  // https://www.npmjs.com/package/gulp-gzip
  gzipOptions: {
    gzipOptions: { level: 9 }
  }
};

// copy
// -----------------------------------------------------------------------------

config.assets.copy = {
};

// css
// -----------------------------------------------------------------------------

config.assets.css = {
  dir: 'css',
  files: ['**/{bundle,bundle-*}.*'],

  // https://www.npmjs.com/package/gulp-autoprefixer
  autoprefixerOptions: {
  },

  // https://www.npmjs.com/package/gulp-minify-css
  minifyCssOptions: {
  },

  // https://www.npmjs.com/package/gulp-sass
  sassOptions: {
  },

  // https://www.npmjs.com/package/gulp-less
  lessOptions: {
  }
};

// img
// -----------------------------------------------------------------------------

config.assets.img = {
  dir: 'img',
  files: ['**/*'],

  // https://www.npmjs.com/package/gulp-imagemin
  imageminOptions: {
  }
};

// js
// -----------------------------------------------------------------------------

config.assets.js = {
  dir: 'js',
  files: ['**/{bundle,bundle-*}.*'],

  // https://www.npmjs.com/package/browserify
  browserifyOptions: {
  },

  // https://www.npmjs.com/package/gulp-uglify
  uglifyOptions: {
  }
};

// -----------------------------------------------------------------------------
// Merge & Add Paths
// -----------------------------------------------------------------------------

var overrides = path.join(process.cwd(), 'lgconfig.js');

try {
  fs.accessSync(overrides, fs.R_OK);
  gutil.log('Using lgconfig ' + gutil.colors.magenta(tildify(overrides)));
} catch (err) {
  overrides = undefined;
  gutil.log(gutil.colors.red('No lgconfig found'));
}

if (overrides) {
  _.merge(config, require(overrides));
}

var addPaths = function (c, dir) {
  c.srcPath = path.join(config.assets.srcPath, dir);
  c.tmpPath = path.join(config.assets.tmpPath, dir);
  c.watches = path.join(c.srcPath, '/**/*');
  c.src = c.files.map(function (f) { return path.join(c.srcPath, f); });
};

[config.assets.css, config.assets.js, config.assets.img].forEach(function (c) {
  addPaths(c, c.dir);
});

_.forOwn(config.assets.copy, function (c, dir) {
  (c.dir = dir) && addPaths(c, c.dir);
});

module.exports = config;
