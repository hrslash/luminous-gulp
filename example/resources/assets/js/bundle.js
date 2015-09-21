var $ = require('global-jquery');
var attachFastClick = require('fastclick');

// https://github.com/ftlabs/fastclick
$(function () {
  attachFastClick(document.body);
});
