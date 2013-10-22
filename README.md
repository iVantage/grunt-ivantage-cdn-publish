# grunt-ivantage-cdn-publish

> Send static build artifacts to the static file server to be picked up by our cdn.

## Getting Started
This plugin requires Grunt `~0.4.0rc7`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ivantage-cdn-publish --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ivantage-cdn-publish');
```

## The "ivantage_cdn_publish" task

### Overview
In your project's Gruntfile, add a section named `ivantage_cdn_publish` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ivantage_cdn_publish: {
    options: {
      cwd: 'dist' // Assets referenced and packaged relative to this dir
    },
    project_id: { // Assets will be provided by cdn under  this id
      assets: ['scripts/*.js', 'styles/main.css', 'img/*']
    }
  }
});
```

### Options

#### cwd
Type: `String`
Default: `''`

Assets will be pushed to the static file server under their appropriate
namespace in a directory structure mirroring their layout under `cwd`.

You should also provide asset paths relative to this directory as well.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
