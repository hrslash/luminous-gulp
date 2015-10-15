$ = require 'jquery'
attachFastClick = require 'fastclick'

# https://api.jquery.com/jquery-2/
console.log 'jQuery version: ' + $.fn.jquery

# https://github.com/ftlabs/fastclick
$ -> attachFastClick document.body
