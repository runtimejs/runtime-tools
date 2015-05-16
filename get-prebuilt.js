var nugget = require('nugget');
var shell = require('shelljs');
var path = require('path');

module.exports = function(kernelVersion, cb) {
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
