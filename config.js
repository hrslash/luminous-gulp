'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var config = {};

// -----------------------------------------------------------------------------
// assets
// -----------------------------------------------------------------------------

config.assets = {
  publicPath: './assets',
  srcPath: './resources/assets',
  tmpPath: './storage/framework/assets',

  // https://www.npmjs.com/package/gulp-rev-all
  revAllOptions: {
    prefix: '/assets/', // Public URL
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
  files: ['main.*'],

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
  files: ['main.*'],

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

var overrides = path.join(process.cwd(), 'lg-config.js');

try {
  fs.accessSync(overrides, fs.R_OK);
} catch (err) {
  overrides = undefined;
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
  addPaths(c, dir);
});

module.exports = config;
