var nugget = require('nugget');
var shell = require('shelljs');
var path = require('path');

module.exports = function(kernelVersion, cb) {
  var globalModulePath = shell.exec('npm config get prefix', {
    silent: true
  }).output;
  // remove newline:
  if (globalModulePath.substr(globalModulePath.length-1) === '\n') globalModulePath = globalModulePath.substr(0, globalModulePath.length-1);
  // if it's installed as global:
  if (__dirname.substr(0, globalModulePath.length) === globalModulePath) {
    // if it's not run as root
    if (process.geteuid() !== 0) {
      return cb(new Error('must be run as root in order to download the kernel globally.'));
    }
  }

  var kernelsDir = path.resolve(__dirname, 'runtimejs-kernels');
  if (!shell.test('-d', kernelsDir)) {
    shell.mkdir(kernelsDir);
  }

  var tmpName = 'runtime-download-' + kernelVersion;
  var tmpFile = path.resolve(kernelsDir, tmpName);
  var resultFile = path.resolve(kernelsDir, 'runtime-' + kernelVersion);

  if (shell.test('-f', resultFile)) {
    return cb(null, resultFile);
  }

  if (shell.test('-f', tmpFile)) {
    shell.rm('-f', tmpFile);
  }

  nugget('https://github.com/runtimejs/builds/raw/master/runtime-' + kernelVersion, {
    dir: kernelsDir,
    target: tmpName,
    verbose: true
  }, function(err) {
    if (err) {
      return cb(err);
    }

    if (!shell.test('-f', tmpFile)) {
      return cb(new Error('download error'));
    }

    shell.mv('-f', tmpFile, resultFile);
    return cb(null, resultFile);
  });
};
