/*
 * grunt-ivantage-cdn-publish
 * https://github.com/iVantage/grunt-ivantage-cdn-publish
 *
 * Copyright (c) 2013 jtrussell
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var async = grunt.util.async
    , _ = grunt.util._
    , exec = require('shelljs').exec;

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('ivantage_cdn_publish', 'Send static build artifacts to the static file server to be picked up by our cdn.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      cwd: process.cwd(),
      concurrency: 5,
      scp: 'scp'
    });

    grunt.config.requires([this.name, this.target, 'assets'].join('.'));
    grunt.config.requires([this.name, this.target, 'version'].join('.'));

    var assets = grunt.file.expand({cwd: options.cwd}, this.data.assets)
      , done = _.after(assets.length, this.async());

    var sendFile = function(file, cb) {
      var cmd = options.scp + ' -r "' + file + '" cdn@static.ivantagehealth.com:/home/cdn/www/ivantage/' + this.target + '/' + this.target + '-' + this.version + '/';
      exec(cmd, function(code, output) {
        return code > 0 ? cb(output) : cb();
      });
    };

    async.eachLimit(assets, options.concurrency, sendFile, function(err) {
      if(err) {
        grunt.log.error(err);
        grunt.fail.fatal('Failed pushing files to the cdn');
      }
      done();
    });

    console.log(assets);

  });


};
