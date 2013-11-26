/*
 * grunt-ivantage-cdn-publish
 * https://github.com/iVantage/grunt-ivantage-cdn-publish
 *
 * Copyright (c) 2013 jtrussell
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var _ = require('lodash')
    , request = require('request')
    , async = require('async')
    , exec = require('shelljs').exec
    , cd = require('shelljs').cd;

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('ivantage_cdn_publish', 'Send static build artifacts to the static file server to be picked up by our cdn.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var target = this.target
      , options = this.options({
          cwd: process.cwd(),
          scp: process.platform.match(/^win/) ? 'pscp' : 'scp',
          remoteCommand: process.platform.match(/^win/) ? 'plink' : 'ssh -t',
          concurrency: 2,
          force: false
        });

    grunt.config.requires([this.name, target, 'assets'].join('.'));
    grunt.config.requires([this.name, target, 'version'].join('.'));

    var assets = this.data.assets
      , version = this.data.version
      , origCwd = process.cwd()
      , done = _.after(assets.length, this.async());

    var remoteDir = '/home/cdn/www/ivantage/' + target + '/' + target + '-' + version + '/';

    var sendAsset = function(asset, cb) {
      var cmd = options.scp + ' -r "' + asset + '" cdn@static.ivantagehealth.internal:' + remoteDir;
      exec(cmd, function(code, output) {
        return code > 0 ? cb(output) : cb();
      });
    };

    // Don't send duplicates - wasteful if overwrite is true...
    request.get('http://static.ivantagehealth.com/manifest.json', function(err, response, body) {
      if(err || 200 !== response.statusCode) {
        return grunt.fail.fatal('Could not get manifest from static file server');
      }

      var assetsMap = JSON.parse(body).ivantage;

      if(!options.force && assetsMap.hasOwnProperty(target) && assetsMap[target].indexOf(target + '-' + version) > -1) {
        grunt.log.ok('Skipping publish to CDN for ' + target + '@' + version + ' since it already exists.');
        return done();
      }

      // Create the remote directory we're going to copy stuff into
      if(exec(options.remoteCommand + ' cdn@static.ivantagehealth.internal "mkdir -p ' + remoteDir + '"') > 0) {
        return grunt.fail.fatal('Failed trying to create a folder for this repo on the CDN');
      }

      cd(options.cwd);

      async.eachLimit(assets, options.concurrency, sendAsset, function(err) {
        if(err) {
          grunt.log.error(err);
          return grunt.fail.fatal('Failed pushing files to the cdn');
        }

        cd(origCwd); // Restore CWD

        grunt.log.ok('Finished pushing files to the CDN');
        done();
      });

    });
  });
};
