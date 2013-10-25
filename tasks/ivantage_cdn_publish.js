/*
 * grunt-ivantage-cdn-publish
 * https://github.com/iVantage/grunt-ivantage-cdn-publish
 *
 * Copyright (c) 2013 jtrussell
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var _ = grunt.util._
    , async = require('async')
    , exec = require('shelljs').exec;

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('ivantage_cdn_publish', 'Send static build artifacts to the static file server to be picked up by our cdn.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var target = this.target
      , options = this.options({
          cwd: process.cwd(),
          scp: 'scp',
          concurrency: 2
        });

    grunt.config.requires([this.name, target, 'assets'].join('.'));
    grunt.config.requires([this.name, target, 'version'].join('.'));

    var assets = this.data.assets
      , version = this.data.version
      , done = _.after(assets.length, this.async());

    var sendAsset = function(asset, cb) {
      var cmd = options.scp + ' -r "' + asset + '" cdn@static.ivantagehealth.internal:/home/cdn/www/ivantage/' + target + '/' + target + '-' + version + '/';
      exec(cmd, function(code, output) {
        return code > 0 ? cb(output) : cb();
      });
    };

    async.eachLimit(assets, options.concurrency, sendAsset, function(err) {
      if(err) {
        grunt.log.error(err);
        return grunt.fail.fatal('Failed pushing files to the cdn');
      }

      grunt.log.ok('Finished pushing files to the cnd');
      done();
    });

  });


};
