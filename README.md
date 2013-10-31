# grunt-ivantage-cdn-publish

> Send static build artifacts to the static file server to be picked up by our
> cdn.

## Getting Started
This plugin requires Grunt `~0.4.0rc7`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

```shell
npm install grunt-ivantage-cdn-publish --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with
this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ivantage-cdn-publish');
```

## The "ivantage_cdn_publish" task

### Overview
In your project's Gruntfile, add a section named `ivantage_cdn_publish` to the
data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ivantage_cdn_publish: {
    options: {
      cwd: 'dist' // Assets referenced and packaged relative to this dir
    },
    project_id: { // Assets will be provided by CDN under this id
      assets: ['scripts/*.js', 'styles/main.css', 'img/*']
    }
  }
});
```

Note that the `assets` are not expanded per the usual `grunt.file.expand`, they
are passed along to the `scp` command as listed.

The cdn user may only access the static file server using an ssh key - it cannot
log in with a password. On windows we recommend using
[putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) with
[pageant](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

Note you must also configure your hostfile to access the static file server via
the internal network. Add an entry to your hostfile for
`static.ivantagehealth.internal`.

### Options

#### cwd
Type: `String`
Default: `''`

Assets will be pushed to the static file server under their appropriate
namespace in a directory structure mirroring their layout under `cwd`.

You should also provide asset paths relative to this directory as well.

#### scp
Type: `String`
Default: `'scp'` | `'pscp'`

The "secure copy" command you would like to use. Defaults to `'pscp'` on Windows
and `'scp'` everywhere else.

#### remoteCommand
Type: `String`
Default: `'ssh -t'` | `'plink'`

Used to execute generic commands on the remote server. Defaults to `'plink'` on
Window and `'ssh -t'` everywhere else.

#### concurrency
Type: `Integer`
Default: `2`

Assets are send individually as listed in the task config. The option controls
how many outstanding copy requests you can have open at a time.

#### force
Type: `Boolean`
Default: `false`

If true will send files to the CDN even if there is already a folder for the
current version.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
